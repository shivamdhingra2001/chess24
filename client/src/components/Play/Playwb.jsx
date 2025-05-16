
import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

function PlayRandomMoveEngine() {
  const [game, setGame] = useState(new Chess());
  const [history, setHistory] = useState([game.fen()]);
  const [future, setFuture] = useState([]);
  const [gameStatus, setGameStatus] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [boardWidth, setBoardWidth] = useState(Math.min(window.innerWidth * 0.95, 600));

  const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

  // Add a smaller board size for mobile devices
  useEffect(() => {
    function handleResize() {
      const smallerScreenSize = window.innerWidth < 500;
      const screenHeight = window.innerHeight;
      const maxBoardSize = Math.min(
        window.innerWidth * 0.95, 
        // On smaller screens with limited height, use a smaller percentage of the height
        smallerScreenSize ? Math.min(screenHeight * 0.5, 500) : 600
      );
      setBoardWidth(maxBoardSize);
    }
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial size
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function evaluateBoard(game) {
    const board = game.board();
    let score = 0;

    for (let row of board) {
      for (let piece of row) {
        if (piece) {
          const value = pieceValues[piece.type];
          const colorFactor = piece.color === "w" ? 1 : -1;
          score += value * colorFactor;
        }
      }
    }

    return score;
  }

  function minimax(game, depth, isMaximizing, alpha, beta) {
    if (depth === 0 || game.isGameOver()) {
      return evaluateBoard(game);
    }

    const moves = game.moves({ verbose: true });

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        game.move(move);
        const evalScore = minimax(game, depth - 1, false, alpha, beta);
        game.undo();
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        game.move(move);
        const evalScore = minimax(game, depth - 1, true, alpha, beta);
        game.undo();
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  function makeMove(move) {
    try {
      const result = game.move(move);
      if (result) {
        const newFen = game.fen();
        setGame(new Chess(newFen));
        setHistory((prev) => [...prev, newFen]);
        setFuture([]);

        if (game.isGameOver()) {
          if (game.isCheckmate()) {
            setGameStatus(`Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins.`);
          } else if (game.isDraw()) {
            setGameStatus("Game over: Draw!");
          } else if (game.isStalemate()) {
            setGameStatus("Game over: Stalemate!");
          }
        } else {
          setGameStatus("");
        }
        return result;
      }
    } catch (e) {
      console.error("Invalid move", e);
    }
    return null;
  }

  async function makeBotMove() {
    if (game.isGameOver() || isBotThinking) return;

    setIsBotThinking(true);
    const moves = game.moves({ verbose: true });
    if (!moves.length) {
      setIsBotThinking(false);
      return;
    }

    let move;

    switch (difficulty) {
      case "beginner":
        move = moves[Math.floor(Math.random() * moves.length)].san;
        break;

      case "intermediate":
        move = moves
          .filter((m) => m.captured)
          .sort((a, b) => (pieceValues[b.captured] || 0) - (pieceValues[a.captured] || 0))[0]?.san || moves[0].san;
        break;

      case "advanced":
        const depth = 1;
        let bestScore = -Infinity;
        let bestMove = moves[0].san;

        for (const m of moves) {
          const clone = new Chess(game.fen());
          clone.move(m.san);
          const score = minimax(clone, depth, false, -Infinity, Infinity);
          if (score > bestScore) {
            bestScore = score;
            bestMove = m.san;
          }
        }
        move = bestMove;
        break;

      default:
        move = moves[0].san;
    }

    await new Promise((r) => setTimeout(r, 100));
    makeMove(move);
    setIsBotThinking(false);
  }

  function undoMove() {
    if (history.length <= 1) return;
    const newHistory = [...history];
    const lastFen = newHistory.pop();
    const prevFen = newHistory.pop() || history[0];
    setGame(new Chess(prevFen));
    setHistory(newHistory);
    setFuture((prev) => [lastFen, prevFen, ...prev].filter(Boolean));
    setGameStatus("");
  }

  function redoMove() {
    if (future.length === 0) return;
    const newFuture = [...future];
    const nextFen = newFuture.shift();
    setGame(new Chess(nextFen));
    setHistory((prev) => [...prev, nextFen]);
    setFuture(newFuture);

    const tempGame = new Chess(nextFen);
    if (tempGame.isGameOver()) {
      if (tempGame.isCheckmate()) {
        setGameStatus(`Checkmate! ${tempGame.turn() === "w" ? "Black" : "White"} wins.`);
      } else if (tempGame.isDraw()) {
        setGameStatus("Game over: Draw!");
      } else if (tempGame.isStalemate()) {
        setGameStatus("Game over: Stalemate!");
      }
    } else {
      setGameStatus("");
    }
  }

  function resetGame() {
    const newGame = new Chess();
    setGame(newGame);
    setHistory([newGame.fen()]);
    setFuture([]);
    setGameStatus("");
    setIsBotThinking(false);

    if (newGame.turn() === "b") {
      setTimeout(() => makeBotMove(), 100);
    }
  }

  function onDrop(sourceSquare, targetSquare) {
    if (game.isGameOver() || isBotThinking) return false;
    const move = makeMove({ from: sourceSquare, to: targetSquare, promotion: "q" });
    if (!move) return false;
    if (!game.isGameOver()) {
      makeBotMove();
    }
    return true;
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen w-full flex flex-col items-center py-4 px-2 sm:p-4 font-sans">
      <div className="w-full max-w-full sm:max-w-2xl flex flex-col items-center gap-3 sm:gap-4">
        <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">Chess Game</h1>
        
        {/* Difficulty Selector */}
        <div className="w-full max-w-full sm:max-w-[600px] flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <label className="text-white text-base sm:text-lg font-medium">Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={isBotThinking}
            className="px-3 sm:px-4 py-1 sm:py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 w-full sm:w-auto"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Chessboard - Reduced size for mobile */}
        <div className="w-full max-w-full sm:max-w-[600px] bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden relative aspect-square flex items-center justify-center">
          {isBotThinking && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
              <div className="text-white text-lg font-semibold">Bot is thinking...</div>
            </div>
          )}
          <Chessboard
            boardOrientation="white"
            showBoardNotation
            position={game.fen()}
            onPieceDrop={onDrop}
            customDarkSquareStyle={{ backgroundColor: "#779952" }}
            customLightSquareStyle={{ backgroundColor: "#edeed1" }}
            boardWidth={boardWidth}
          />
        </div>

        {/* Game Status */}
        {gameStatus && (
          <div className="w-full max-w-full sm:max-w-[600px] p-2 sm:p-3 rounded-md bg-gray-800 bg-opacity-90 text-white text-center font-bold text-sm sm:text-base md:text-lg shadow-md">
            {gameStatus}
          </div>
        )}

        {/* Controls - Now visible without scrolling */}
        <div className="w-full max-w-full sm:max-w-[600px] grid grid-cols-3 gap-2 sm:gap-3 mt-2">
          <button
            onClick={undoMove}
            disabled={history.length <= 1 || isBotThinking}
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md text-white font-medium transition-all duration-200 text-sm ${
              history.length <= 1 || isBotThinking ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Undo
          </button>
          <button
            onClick={redoMove}
            disabled={future.length === 0 || isBotThinking}
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md text-white font-medium transition-all duration-200 text-sm ${
              future.length === 0 || isBotThinking ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Redo
          </button>
          <button
            onClick={resetGame}
            disabled={isBotThinking}
            className={`px-2 sm:px-4 py-1 sm:py-2 rounded-md text-white font-medium transition-all duration-200 text-sm ${
              isBotThinking ? "bg-gray-500 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
            }`}
          >
            Reset
          </button>
        </div>

        {/* Game Information - Condensed for mobile */}
        <div className="w-full max-w-full sm:max-w-[600px] mt-1 p-2 sm:p-3 rounded-md bg-gray-800 text-white text-xs sm:text-sm">
          <p className="mb-1">• Make a move by dragging and dropping pieces</p>
          <p className="mb-1">• The bot will automatically respond after your move</p>
          <p>• Adjust difficulty using the selector above</p>
        </div>
      </div>
    </div>
  );
}

export default PlayRandomMoveEngine;