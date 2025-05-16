import React, { useEffect, useState, useRef, useContext } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useParams } from "react-router-dom";
import MiniDrawer from "../Home/Minidrawer";
import { motion } from "framer-motion";
import { useSocket } from "../../providers/socketContext";
import { UserDetailsContext } from "../Authentication/AuthRoute";

function PlayWithFriendRoom() {
  const { roomCode } = useParams();
  const socket = useSocket();
  const userDetailsContext = useContext(UserDetailsContext);
  const userDetails = userDetailsContext?.userDetails || {};
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(new Chess().fen());
  const [gameStatus, setGameStatus] = useState("");
  const [playerColor, setPlayerColor] = useState(null); // 'w' or 'b'
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const gameRef = useRef(game);
  const [boardSize, setBoardSize] = useState(500);

  // Dynamically calculate board size based on screen dimensions
  useEffect(() => {
    const updateBoardSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      const sidebarWidth = 70;
      const padding = screenWidth < 640 ? 16 : 32;
      const availableWidth = screenWidth - sidebarWidth - (padding * 2);
      const availableHeight = screenHeight - 200;
      
      let size;
      if (screenWidth < 640) {
        size = availableWidth * 0.95;
      } else if (screenWidth < 1024) {
        size = availableWidth * 0.85;
      } else {
        size = Math.min(availableWidth * 0.75, 600);
      }
      
      size = Math.min(size, availableHeight);
      setBoardSize(size);
    };
    
    updateBoardSize();
    window.addEventListener("resize", updateBoardSize);
    return () => window.removeEventListener("resize", updateBoardSize);
  }, []);

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log("[socket] Connected:", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("[socket] Disconnected");
    });
    socket.on("connect_error", (err) => {
      console.error("[socket] Connection error:", err);
    });
    socket.on("roomInfo", ({ color, opponent }) => {
      console.log("[roomInfo] Received:", { color, opponent });
      setPlayerColor(color);
      setIsMyTurn(color === "w");
      setWaiting(false);
    });
    socket.on("opponentJoined", ({ opponent }) => {
      console.log("[opponentJoined] Received:", { opponent });
      setWaiting(false);
    });
    socket.on("move", ({ move }) => {
      const chess = new Chess(move);
      setGame(chess);
      setFen(chess.fen());
      setIsMyTurn(true);
      if (chess.isGameOver()) {
        if (chess.isCheckmate()) {
          setGameStatus(`Checkmate! ${chess.turn() === "w" ? "Black" : "White"} wins.`);
        } else if (chess.isDraw()) {
          setGameStatus("Game over: Draw!");
        } else if (chess.isStalemate()) {
          setGameStatus("Game over: Stalemate!");
        }
      } else {
        setGameStatus("");
      }
    });
    socket.on("friendMove", ({ move }) => {
      const chess = new Chess(move);
      setGame(chess);
      setFen(chess.fen());
      setIsMyTurn(true);
      if (chess.isGameOver()) {
        if (chess.isCheckmate()) {
          setGameStatus(`Checkmate! ${chess.turn() === "w" ? "Black" : "White"} wins.`);
        } else if (chess.isDraw()) {
          setGameStatus("Game over: Draw!");
        } else if (chess.isStalemate()) {
          setGameStatus("Game over: Stalemate!");
        }
      } else {
        setGameStatus("");
      }
    });
    socket.on("opponentResigned", () => {
      console.log("[opponentResigned] Received");
      setGameStatus("Opponent resigned. You win!");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("roomInfo");
      socket.off("opponentJoined");
      socket.off("move");
      socket.off("friendMove");
      socket.off("opponentResigned");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      console.error("[joinRoom] No socket instance");
      return;
    }
    if (!userDetails?.username) {
      console.log("[joinRoom] Waiting for userDetails.username...", userDetails);
      return;
    }
    socket.emit("joinRoom", { roomId: roomCode, username: userDetails.username });
  }, [socket, userDetails?.username, roomCode]);

  function makeMove(move) {
    try {
      const result = gameRef.current.move(move);
      if (result) {
        const newFen = gameRef.current.fen();
        setGame(new Chess(newFen));
        setFen(newFen);
        setIsMyTurn(false);
        socket.emit("friendMove", { roomId: roomCode, move: newFen });
        if (gameRef.current.isGameOver()) {
          if (gameRef.current.isCheckmate()) {
            setGameStatus(`Checkmate! ${gameRef.current.turn() === "w" ? "Black" : "White"} wins.`);
          } else if (gameRef.current.isDraw()) {
            setGameStatus("Game over: Draw!");
          } else if (gameRef.current.isStalemate()) {
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

  function onDrop(sourceSquare, targetSquare) {
    if (gameStatus || !isMyTurn) return false;
    const move = makeMove({ from: sourceSquare, to: targetSquare, promotion: "q" });
    if (!move) return false;
    return true;
  }

  function handleResign() {
    setGameStatus("You resigned. Your opponent wins.");
    socket.emit("resign", { roomId: roomCode });
  }

  function goToHome() {
    window.location.href = '/home';
  }

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
      .then(() => console.log("Room code copied!"))
      .catch(err => console.error("Failed to copy room code:", err));
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen w-full flex flex-row overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-700 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-white opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
      
      <MiniDrawer />
      
      <div className="flex flex-col items-center justify-center w-full px-2 sm:px-6 md:px-12 py-4 sm:py-8 md:py-12 gap-4 sm:gap-6 z-10 mt-16 sm:mt-8">
        {/* Updated Room Code Section */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
          <motion.h1
            className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-100 drop-shadow text-center break-words"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
          >
            Room Code:
          </motion.h1>
          <motion.div
            className="flex items-center bg-gray-800/50 rounded-lg px-3 py-1 border border-blue-700/30 max-w-[90vw] sm:max-w-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            <span className="text-blue-400 font-mono text-sm sm:text-base md:text-lg break-all mr-2">{roomCode}</span>
            <button
              onClick={copyRoomCode}
              className="text-blue-300 hover:text-blue-100 transition"
              aria-label="Copy room code"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </motion.div>
        </div>

        {waiting ? (
          <motion.div
            className="text-blue-200 text-sm sm:text-base bg-gray-800/70 rounded-xl px-4 sm:px-6 py-3 sm:py-4 border border-blue-700/50 shadow-lg text-center max-w-md mx-auto mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-400"></div>
              Waiting for your friend to join...
            </div>
            <p className="mt-2 text-xs sm:text-sm text-blue-300/80">
              Share the room code with your friend to start playing
            </p>
          </motion.div>
        ) : (
          <div className="relative w-full flex justify-center">
            <div className="relative">
              {isMyTurn && !gameStatus && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-md z-10">
                  Your turn
                </div>
              )}
              
              <div className="bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden">
                <Chessboard
                  boardOrientation={playerColor === 'b' ? 'black' : 'white'}
                  showBoardNotation
                  position={fen}
                  onPieceDrop={onDrop}
                  customDarkSquareStyle={{ backgroundColor: '#779952' }}
                  customLightSquareStyle={{ backgroundColor: '#edeed1' }}
                  boardWidth={boardSize}
                />
              </div>
              
              <div className="absolute right-0 md:-right-16 top-1/2 transform translate-x-full -translate-y-1/2 flex flex-col gap-3">
                <motion.button
                  onClick={handleResign}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-lg flex items-center justify-center w-10 h-10 md:w-12 md:h-12"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!!gameStatus}
                  aria-label="Resign"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
                
                <motion.button
                  onClick={goToHome}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg flex items-center justify-center w-10 h-10 md:w-12 md:h-12"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Home"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
        )}

        {gameStatus && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/60">
            <motion.div 
              className="w-full max-w-xs sm:max-w-sm bg-gray-900 text-white text-center font-bold rounded-2xl shadow-2xl p-4 sm:p-6 border-2 border-blue-500"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <span className="text-base sm:text-xl md:text-2xl text-blue-300 mb-4 block">{gameStatus}</span>
              <button
                onClick={goToHome}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-lg transition text-sm sm:text-base mt-4"
              >
                Go to Home
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayWithFriendRoom;