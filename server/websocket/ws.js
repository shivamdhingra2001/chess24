const getGameData = require("./getGameData");
const handleMove = require("./handleMove");
const matchMaking = require("./matchMaking");
const User = require("../models/User");

const queue = [];
const friendRooms = {};

const ws = (io, socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinRoom', ({ roomId, username }) => {
    console.log(`[ws.js] joinRoom received:`, { roomId, username });
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.data.username = username;
    // Emit userJoined to others in the room
    socket.to(roomId).emit('userJoined', { username });

    if (!friendRooms[roomId]) {
      friendRooms[roomId] = {
        players: [{ id: socket.id, username, color: 'w' }],
        fen: new (require('chess.js')).Chess().fen(),
      };
      console.log(`[ws.js] First player joined. Emitting roomInfo to ${socket.id}`);
      socket.emit('roomInfo', { color: 'w', opponent: null });
    } else if (friendRooms[roomId].players.length === 1) {
      const opponent = friendRooms[roomId].players[0];
      friendRooms[roomId].players.push({ id: socket.id, username, color: 'b' });
      console.log(`[ws.js] Second player joined. Emitting roomInfo to both:`, {
        toBlack: socket.id,
        toWhite: opponent.id,
        black: username,
        white: opponent.username,
      });
      io.to(socket.id).emit('roomInfo', { color: 'b', opponent: { username: opponent.username } });
      io.to(opponent.id).emit('roomInfo', { color: 'w', opponent: { username } });
      io.to(socket.id).emit('opponentJoined', { opponent: { username: opponent.username } });
      io.to(opponent.id).emit('opponentJoined', { opponent: { username } });
    } else {
      console.log(`[ws.js] Room full for roomId:`, roomId);
      socket.emit('roomFull');
    }
  });

  socket.on("findGame", (data) => matchMaking(io, queue, data));

  socket.on("getGameData", (data) => getGameData(io, socket, data));

  // Timed/standard games: use DB and timer logic
  socket.on("move", (data) => {
    // Only handle standard (timed) games
    handleMove(socket, data);
  });

  // Friend/untimed games: update in-memory and emit move only (no timer)
  socket.on("friendMove", (data) => {
    const { roomId, move } = data;
    if (friendRooms[roomId]) {
      friendRooms[roomId].fen = move;
      socket.to(roomId).emit("friendMove", { move });
    }
  });

  socket.on("resign", async (data) => {
    const { roomId, userId } = data;
    if (friendRooms[roomId]) {
      // Friend room: just emit to opponent
      socket.to(roomId).emit("opponentResigned");
      // Optionally, you could mark the room as over in memory if needed
    } else {
      // Standard room: use DB
      const game = await require("../models/GameRoom").findById(roomId);
      if (game && !game.isOver) {
        game.isOver = true;
        let winnerId = null,
          loserId = null;
        if (String(game.white) === String(userId)) {
          winnerId = game.black;
          loserId = game.white;
          game.winner = "black";
        } else {
          winnerId = game.white;
          loserId = game.black;
          game.winner = "white";
        }
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
        await game.save();
      }
      socket.to(roomId).emit("opponentResigned");
    }
  });

  socket.on('sendMessage', ({ roomId, username, message }) => {
    const payload = { username, message, timestamp: Date.now() };
    io.to(roomId).emit('msg-receive', payload);
  });

  socket.on('draw', ({ roomId, userId }) => {
    socket.to(roomId).emit('drawRequest', { userId });
  });

  socket.on('confirmDraw', async ({ roomId, userId, accept }) => {
    if (accept) {
      const game = await require("../models/GameRoom").findById(roomId);
      if (game && !game.isOver) {
        game.isOver = true;
        const User = require("../models/User");
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
        await game.save();
      }
      io.to(roomId).emit('drawOccurred');
    } else {
      socket.to(roomId).emit('drawRejected');
    }
  });

  socket.on('typing', ({ roomId, username }) => {
    socket.to(roomId).emit('userTyping', { username });
  });

  socket.on('stopTyping', ({ roomId, username }) => {
    socket.to(roomId).emit('userStopTyping', { username });
  });

  socket.on('disconnect', () => {
    const { roomId, username } = socket.data || {};
    if (roomId && friendRooms[roomId]) {
      friendRooms[roomId].players = friendRooms[roomId].players.filter((p) => p.id !== socket.id);
      if (friendRooms[roomId].players.length === 0) {
        delete friendRooms[roomId];
      }
    }
    if (roomId && username) {
      socket.to(roomId).emit('userLeft', { username });
    }
    console.log(`User disconnected: ${socket.id}`);
  });

  socket.on('timeoutLoss', async ({ roomId, loserColor }) => {
    const game = await require("../models/GameRoom").findById(roomId);
    if (game && !game.isOver) {
      game.isOver = true;
      let winnerId = null, loserId = null;
      if (loserColor === "white") {
        winnerId = game.black;
        loserId = game.white;
        game.winner = "black";
      } else {
        winnerId = game.white;
        loserId = game.black;
        game.winner = "white";
      }
      const User = require("../models/User");
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
      await game.save();
      io.to(roomId).emit('timeoutLoss', { loserColor });
    }
  });
};

module.exports = ws;