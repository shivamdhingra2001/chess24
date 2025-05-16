const { Chess } = require("chess.js");
const GameRoom = require("../models/GameRoom");
const User = require("../models/User");

const handleMove = async (socket, data) => {
  try {
    const { roomId, move, color } = data;
    const currentPosi = new Chess(move);
    const game = await GameRoom.findById(roomId);
    if (!game) return;

    let timew = game.remTimew;
    let timeb = game.remTimeb;
    const now = new Date();

    const diff = game.lastMoveTime ? (now - game.lastMoveTime) / 1000 : 0;

    if (color === "white") {
      let remTimew = game.remTimew - diff;
      if (remTimew < 0) remTimew = 0;
      game.remTimew = remTimew;
      timew = remTimew;
    } else {
      let remTimeb = game.remTimeb - diff;
      if (remTimeb < 0) remTimeb = 0;
      game.remTimeb = remTimeb;
      timeb = remTimeb;
    }

    game.currentFen = move;
    game.lastMoveTime = now;

    if (currentPosi.isGameOver()) {
      game.isOver = true;

      let winnerId = null,
        loserId = null;

      if (currentPosi.isCheckmate()) {
        if (currentPosi.turn() === "w") {
          winnerId = game.black;
          loserId = game.white;
          game.winner = "black";
        } else {
          winnerId = game.white;
          loserId = game.black;
          game.winner = "white";
        }
      } else if (currentPosi.isDraw()) {
        const whiteUser = await User.findById(game.white);
        const blackUser = await User.findById(game.black);
        if (whiteUser) {
          whiteUser.draws += 1;
          whiteUser.gameHistory.push(game._id);
          await whiteUser.save();
        }
        if (blackUser) {
          blackUser.draws += 1;
          blackUser.gameHistory.push(game._id);
          await blackUser.save();
        }
      }

      if (winnerId && loserId) {
        const winner = await User.findById(winnerId);
        const loser = await User.findById(loserId);
        if (winner) {
          winner.wins += 1;
          winner.rating += 6;
          winner.gameHistory.push(game._id);
          await winner.save();
        }
        if (loser) {
          loser.losses += 1;
          loser.rating -= 6;
          loser.gameHistory.push(game._id);
          await loser.save();
        }
      }
    }

    socket.to(roomId).emit("move", {
      move,
      timew,
      timeb,
      serverTime: now.getTime(),
    });
    await game.save();
  } catch (error) {
    console.log(error);
  }
};

module.exports = handleMove;