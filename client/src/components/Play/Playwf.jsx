import React, { useState } from "react";
import MiniDrawer from "../Home/Minidrawer";
import { motion } from "framer-motion";
import { AuthRoute } from '../Authentication/AuthRoute';

const generateRoomCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

function Playwf() {
  const [mode, setMode] = useState(null); // 'create' or 'join'
  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setMode("created");
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (inputCode.trim().length === 6) {
      // Navigate to the game room (replace with your routing logic)
      window.location.href = `/playwf/room/${inputCode.trim().toUpperCase()}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen w-full flex flex-row overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-700 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-white opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
      <MiniDrawer />
      <div className="flex flex-col items-center justify-center w-full px-2 sm:px-6 md:px-12 lg:px-20 py-8 sm:py-16 md:py-20 gap-6 sm:gap-8 z-10">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-100 drop-shadow mb-2 text-center break-words"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
        >
          Play with a Friend
        </motion.h1>
        <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mb-4 sm:mb-6 animate-pulse" />
        {!mode && (
          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
          >
            <motion.button
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-lg sm:text-xl w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCreate}
            >
              Create Room
            </motion.button>
            <motion.button
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-lg hover:from-blue-500 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-lg sm:text-xl w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode('join')}
            >
              Join Room
            </motion.button>
          </motion.div>
        )}
        {mode === 'created' && (
          <motion.div
            className="flex flex-col items-center bg-[#232b3b]/90 rounded-2xl p-4 sm:p-8 border border-gray-700 shadow-2xl mt-4 sm:mt-6 w-full max-w-[98vw] sm:max-w-md"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 60 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-200 mb-2 text-center">Room Created!</h2>
            <p className="text-blue-100 mb-4 text-center">Share this code with your friend:</p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-4 w-full justify-center">
              <span className="text-2xl sm:text-3xl font-mono text-blue-400 bg-[#1e293b] px-4 sm:px-6 py-2 rounded-lg border border-blue-700 tracking-widest select-all text-center">
                {roomCode}
              </span>
              <button
                onClick={handleCopy}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow w-full sm:w-auto mt-2 sm:mt-0"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <button
              onClick={() => window.location.href = `/playwf/room/${roomCode}`}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold shadow text-lg w-full sm:w-auto"
            >
              Start Game
            </button>
            <button
              onClick={() => { setMode(null); setRoomCode(''); }}
              className="mt-4 text-blue-300 underline hover:text-blue-400 transition w-full sm:w-auto"
            >
              Back
            </button>
          </motion.div>
        )}
        {mode === 'join' && (
          <motion.form
            className="flex flex-col items-center bg-[#232b3b]/90 rounded-2xl p-4 sm:p-8 border border-gray-700 shadow-2xl mt-4 sm:mt-6 gap-3 sm:gap-4 w-full max-w-[98vw] sm:max-w-md"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 60 }}
            onSubmit={handleJoin}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-200 mb-2 text-center">Join a Friend's Room</h2>
            <input
              type="text"
              maxLength={6}
              value={inputCode}
              onChange={e => setInputCode(e.target.value.toUpperCase())}
              className="bg-[#1e293b] text-blue-100 px-4 sm:px-6 py-2 rounded-lg border border-blue-700 text-xl sm:text-2xl font-mono tracking-widest text-center focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-700 transition-all duration-200 placeholder:text-gray-500 mb-2 w-full"
              placeholder="Enter Room Code"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow text-lg w-full sm:w-auto"
              disabled={inputCode.length !== 6}
            >
              Join Room
            </button>
            <button
              type="button"
              onClick={() => { setMode(null); setInputCode(''); }}
              className="mt-2 text-blue-300 underline hover:text-blue-400 transition w-full sm:w-auto"
            >
              Back
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}

export default Playwf;
