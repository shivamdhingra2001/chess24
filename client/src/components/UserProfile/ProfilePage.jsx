import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MiniDrawer from "../Home/Minidrawer";
import axios from "axios";
// import { LineChart } from '@mui/x-charts/LineChart';
import { HiTrophy } from "react-icons/hi2";
import { FaChessBoard } from "react-icons/fa6";

function ProfilePage() {
  const params = useParams();
  const [userDetails, setuserDetails] = useState({ loading: true });

  const { id } = params;
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/users/user/${id}`,
          { withCredentials: true }
        );
        setuserDetails({ ...response.data, loading: false });
      } catch (error) {
        console.log(error);
      }
    };
    getUserDetails();
  }, [id]);
  if (userDetails.loading)
    return (
      <div className="bg-background w-full h-full flex flex-row">
        <MiniDrawer />{" "}
      </div>
    );
  return (
    <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 min-h-screen w-full flex flex-row">
      <MiniDrawer />
      <div className="flex flex-col items-start justify-start w-full px-2 sm:px-6 md:px-20 py-8 sm:py-12 md:py-28 gap-4 sm:gap-6">
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-100 mb-2 sm:mb-4 drop-shadow-lg">
          Profile
        </span>
        <div className="flex flex-col items-center justify-center w-full bg-blue-900/60 rounded-2xl shadow-xl px-2 sm:px-6 md:px-20 py-6 sm:py-10 gap-4 sm:gap-6 border border-blue-700/60">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full lg:w-fit">
              <img
                src={userDetails.profilePicture}
                alt="avatar"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-blue-400 shadow-lg bg-blue-950/60 object-cover"
              />
              <div className="flex flex-col items-center sm:items-start justify-center gap-1 sm:gap-2">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-100 drop-shadow">
                  {userDetails.username}
                </span>
                <span className="flex flex-row items-center gap-1 sm:gap-2 text-lg sm:text-2xl md:text-3xl font-semibold text-yellow-300 drop-shadow">
                  <HiTrophy />
                  {userDetails.rating}
                </span>
              </div>
            </div>
            <div className="flex flex-row lg:flex-col w-full lg:w-fit bg-blue-800/60 rounded-xl p-3 sm:p-4 border border-blue-700/40 shadow justify-between lg:justify-start gap-3 lg:gap-0 mt-3 lg:mt-0">
              <span className="text-base sm:text-lg md:text-xl text-blue-200 font-semibold mb-1 lg:mb-2">
                Stats
              </span>
              <span className="text-sm sm:text-md md:text-lg font-light text-blue-100">
                Wins:{" "}
                <span className="font-bold text-green-400">{userDetails.wins}</span>
              </span>
              <span className="text-sm sm:text-md md:text-lg font-light text-blue-100">
                Losses:{" "}
                <span className="font-bold text-red-400">{userDetails.losses}</span>
              </span>
              <span className="text-sm sm:text-md md:text-lg font-light text-blue-100">
                Draws:{" "}
                <span className="font-bold text-yellow-200">{userDetails.draws}</span>
              </span>
            </div>
            <div className="flex flex-col items-center mt-3 lg:mt-0 w-full lg:w-auto">
              <button className="w-full lg:w-auto bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-semibold rounded-xl px-4 sm:px-6 py-2 sm:py-3 shadow-lg border border-blue-300/40 flex flex-row items-center gap-2 transition-all duration-200 text-base sm:text-lg">
                Challenge <FaChessBoard className="text-lg sm:text-xl" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3 mt-4 sm:mt-6 w-full bg-blue-900/60 rounded-2xl shadow-lg px-2 sm:px-4 md:px-10 py-4 sm:py-8 border border-blue-700/60">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-100 mb-1 sm:mb-2 drop-shadow">
            Game History
          </span>
          {userDetails.gameHistory && userDetails.gameHistory.length === 0 ? (
            <span className="text-base sm:text-lg font-light text-blue-300">
              No games played yet
            </span>
          ) : (
            <div className="flex flex-col gap-1 sm:gap-2 max-h-56 sm:max-h-64 overflow-y-auto pr-1 sm:pr-2">
              {(() => {
                const seen = new Set();
                return userDetails.gameHistory &&
                  userDetails.gameHistory.filter((game) => {
                    if (seen.has(game._id)) return false;
                    seen.add(game._id);
                    return true;
                  })
                    .map((game, idx) => {
                      const isWhite =
                        game.white && game.white._id === userDetails._id;
                      const opponent = isWhite ? game.black : game.white;
                      let result = "Draw";
                      if (game.winner === "white") result = isWhite ? "Win" : "Loss";
                      if (game.winner === "black") result = isWhite ? "Loss" : "Win";
                      return (
                        <div
                          key={game._id}
                          className="flex flex-row items-center justify-between bg-blue-800/70 rounded-lg px-2 sm:px-4 py-1 sm:py-2 border border-blue-700/40 shadow hover:bg-blue-700/60 transition"
                        >
                          <div className="flex flex-row items-center gap-1 sm:gap-2">
                            <img
                              src={opponent?.profilePicture}
                              alt="avatar"
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-blue-400"
                            />
                            <span className="text-blue-100 font-semibold text-xs sm:text-base">
                              {opponent?.username || "Unknown"}
                            </span>
                          </div>
                          <span
                            className={
                              result === "Win"
                                ? "text-green-400 font-bold text-xs sm:text-base"
                                : result === "Loss"
                                ? "text-red-400 font-bold text-xs sm:text-base"
                                : "text-yellow-200 font-bold text-xs sm:text-base"
                            }
                          >
                            {result}
                          </span>
                          <span className="text-blue-400 font-light text-xs sm:text-base">
                            {game.createdAt
                              ? new Date(game.createdAt).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                      );
                    });
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
