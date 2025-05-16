import React, { useEffect } from 'react'
import { FaRegChessQueen } from "react-icons/fa6";
import { TbBuildingCommunity } from "react-icons/tb";
import { BiSupport } from "react-icons/bi";
import Navbar from '../Navbar/Navbar';
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function LandingPage() {
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/checkauth`, {
            withCredentials: true,
        })
            .then(res => {
                if (res.status === 200) {
                    navigate('/home');
                }
            })
            .catch(() => {
               
            });
    }, [navigate]);

    const handleSignup = () => {
        navigate('/signup');
    };
    return (
    <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#2563eb] min-h-screen w-full flex flex-col overflow-hidden">
      {/* Floating background shapes and chess pieces */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-700 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-white opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
      {/* Chessboard background overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <img src="/images/chessboard.png" alt="chessboard" className="opacity-10 w-[700px] h-[700px] hidden md:block" />
      </div>
      {/* Floating chess pieces */}
      <img src="/images/chess/qw.png" alt="queen" className="absolute left-10 top-32 w-16 h-16 opacity-80 animate-float-slow z-10" />
      <img src="/images/chess/nb.png" alt="knight" className="absolute right-24 top-20 w-14 h-14 opacity-80 animate-float-fast z-10" />
      <img src="/images/chess/rw.png" alt="rook" className="absolute left-1/3 bottom-10 w-12 h-12 opacity-80 animate-float-mid z-10" />
      <img src="/images/chess/bb.png" alt="bishop" className="absolute right-1/4 bottom-24 w-12 h-12 opacity-80 animate-float-mid z-10" />
      {/* Navbar */}
      <nav className="flex items-center justify-between w-full px-8 py-4 z-20">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="logo" className="w-8 h-8" />
          <span className="text-blue-200 text-2xl font-bold tracking-wider drop-shadow">CHESS24</span>
        </div>
        <div className="flex gap-4">
          <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition text-lg">Signup</Link>
          <Link to="/login" className="border border-blue-400 text-blue-200 px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 hover:text-white transition text-lg">Login</Link>
        </div>
      </nav>
      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center w-full px-4 sm:px-10 md:px-20 py-16 gap-8 z-10">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-100 drop-shadow mb-4 text-center tracking-tight">
          <span className="inline-flex items-center gap-2 justify-center">
            <FaRegChessQueen className="inline text-blue-400 text-6xl drop-shadow-lg animate-float-mid" />
            Play Chess. Make Friends. <span className="text-blue-400">Master the Game.</span>
          </span>
        </h1>
        <p className="text-blue-200 text-xl max-w-2xl text-center mb-6 font-light">
          Challenge players worldwide, join tournaments, learn from grandmasters, and enjoy a beautiful, real-time chess experience. Your next move starts here.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center">
          <button onClick={handleSignup} className="bg-gradient-to-r from-yellow-400 via-blue-500 to-blue-700 text-white font-bold px-12 py-5 rounded-2xl shadow-xl hover:from-yellow-300 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-2xl text-center tracking-wide scale-105 hover:scale-110">
            Get Started Free
          </button>
        </div>
        {/* Feature Highlights */}
        <div className="flex flex-col md:flex-row gap-8 mt-10 w-full max-w-4xl justify-center z-10">
          <div className="flex flex-col items-center text-center bg-[#1e293b]/90 rounded-xl p-8 border-2 border-blue-700 shadow-xl hover:shadow-blue-700/40 transition-all duration-200 min-w-[220px]">
            <FaRegChessQueen className="text-yellow-300 text-5xl mb-2 drop-shadow" />
            <span className="text-blue-100 font-bold text-lg mb-1">Real-Time Play</span>
            <span className="text-blue-200 text-base">Instant matchmaking and live games with friends or global players.</span>
          </div>
          <div className="flex flex-col items-center text-center bg-[#1e293b]/90 rounded-xl p-8 border-2 border-blue-700 shadow-xl hover:shadow-blue-700/40 transition-all duration-200 min-w-[220px]">
            <TbBuildingCommunity className="text-green-400 text-5xl mb-2 drop-shadow" />
            <span className="text-blue-100 font-bold text-lg mb-1">Community</span>
            <span className="text-blue-200 text-base">Join clubs, make friends, and chat with fellow chess lovers.</span>
          </div>
          <div className="flex flex-col items-center text-center bg-[#1e293b]/90 rounded-xl p-8 border-2 border-blue-700 shadow-xl hover:shadow-blue-700/40 transition-all duration-200 min-w-[220px]">
            <BiSupport className="text-pink-300 text-5xl mb-2 drop-shadow" />
            <span className="text-blue-100 font-bold text-lg mb-1">Support & Learning</span>
            <span className="text-blue-200 text-base">Lessons, puzzles, and help from chess masters and AI.</span>
          </div>
        </div>
      </main>
      {/* Animations for floating chess pieces */}
      <style>{`
        @keyframes float-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
        @keyframes float-mid { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes float-fast { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        .animate-float-slow { animation: float-slow 5s ease-in-out infinite; }
        .animate-float-mid { animation: float-mid 3.5s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 2.5s ease-in-out infinite; }
      `}</style>
    </div>
    )

}

export default LandingPage