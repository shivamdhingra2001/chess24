import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Cards from "./Cards";
import MiniDrawer from "./Minidrawer";
import { useContext } from "react";
import { UserDetailsContext } from "../Authentication/AuthRoute";

const cardItems = {
  "Play Blitz": {
    title: "Play Blitz",
    subtitle: "Play a quick game of chess",
    image: "images/chessplay.png",
    link: "/play",
  },
  "Play with Friends": {
    title: "Play with Friends",
    subtitle: "Play a game of chess with your friends",
    image: "images/chesswf.png",
    link: "/playwf",
  },
  "Practice with Bots": {
    title: "Practice with Bots",
    subtitle: "Practice your chess skills with bots",
    image: "images/chesswb.png",
    link: "/playwb",
  },
  "Watch Live Games": {
    title: "Your Courses",
    subtitle: "Watch Course Content",
    image: "images/live.png",
    link: "/watch",
  },
};

function Home() {
  const { userDetails } = useContext(UserDetailsContext);
  const navigator = useNavigate();
  const handleClick = (link) => {
    navigator(link);
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-[#1A2525] w-full min-h-screen flex flex-row text-white overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-700 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-white opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
      <MiniDrawer />
      <div className="flex flex-col w-full px-2 sm:px-4 md:px-8 lg:px-12 xl:px-16 py-6 sm:py-10 lg:py-16 gap-6 sm:gap-8 z-20 relative">
        {/* Spacer for navbar */}
        <div className="h-8 sm:h-12 md:h-16 lg:h-4"></div>
        {/* Welcome Section */}
        <motion.div
          className="flex flex-col gap-2 sm:gap-3 text-center"
          style={{ wordBreak: 'break-word' }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
        >
          <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-blue-200 drop-shadow-lg w-full break-words" style={{textShadow: '0 2px 8px #000, 0 1px 0 #1e293b'}}> 
            Welcome, {userDetails.username}!
          </h1>
          <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mb-2 animate-pulse mx-auto" />
          <p className="text-xs xs:text-sm sm:text-lg text-blue-100 font-medium w-full drop-shadow" style={{textShadow: '0 1px 6px #000'}}> 
            Dive into your next chess adventure
          </p>
        </motion.div>

        {/* Cards Section */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 sm:gap-6 w-full"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12 }
            }
          }}
        >
          {Object.keys(cardItems).map((key, idx) => (
            <motion.div
              key={key}
              onClick={() => handleClick(cardItems[key].link)}
              className="flex-1 min-w-[220px] max-w-[320px] sm:min-w-[240px] sm:max-w-[340px] md:min-w-[260px] md:max-w-[360px] lg:min-w-[220px] lg:max-w-[320px] xl:min-w-[260px] xl:max-w-[340px] 2xl:min-w-[280px] 2xl:max-w-[360px] m-1 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer rounded-2xl overflow-hidden border border-gray-700 bg-gradient-to-br from-[#232b3b] to-[#1e293b] shadow-lg"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { delay: idx * 0.08, duration: 0.5 } }
              }}
              whileHover={{ scale: 1.07, boxShadow: "0 8px 32px 0 rgba(0, 123, 255, 0.25)" }}
              whileTap={{ scale: 0.98 }}
            >
              <Cards
                title={cardItems[key].title}
                subtitle={cardItems[key].subtitle}
                image={cardItems[key].image}
                className="bg-transparent hover:bg-blue-900/30 transition-colors duration-200"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Game History Section (Modern Card UI) */}
        <motion.div
          className="flex flex-col gap-4 sm:gap-6 mt-6 sm:mt-10 w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, type: 'spring', stiffness: 60 }}
        >
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold tracking-tight text-blue-200">
            Game History
          </h2>
          <div className="max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-1 sm:pr-2 rounded-xl border border-blue-900 bg-[#181f2a]/60 shadow-inner">
            {userDetails.gameHistory.length === 0 ? (
              <p className="text-sm sm:text-lg font-medium text-blue-100/70 px-2 sm:px-4 py-4 sm:py-6">
                No games played yet. Start a match now!
              </p>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-2 sm:p-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.10 }
                  }
                }}
              >
                {(() => {
                  const seen = new Set();
                  return userDetails.gameHistory.filter((game) => {
                    if (seen.has(game._id)) return false;
                    seen.add(game._id);
                    return true;
                  }).map((game, idx) => {
                    const isWhite = game.white && (game.white._id === userDetails._id || game.white.username === userDetails.username);
                    const opponent = isWhite ? game.black : game.white;
                    let result = "Draw";
                    if (game.winner === "white") result = isWhite ? "Win" : "Loss";
                    if (game.winner === "black") result = isWhite ? "Loss" : "Win";
                    let myElo = isWhite ? game.whiteRatingAtEnd ?? game.white.rating : game.blackRatingAtEnd ?? game.black.rating;
                    let oppElo = isWhite ? game.blackRatingAtEnd ?? opponent?.rating : game.whiteRatingAtEnd ?? opponent?.rating;
                    return (
                      <motion.div
                        key={game._id}
                        className="flex flex-col gap-3 bg-gradient-to-br from-[#232b3b] to-[#1e293b] rounded-2xl p-5 border border-gray-700 hover:border-blue-500 transition-all duration-200 shadow-xl"
                        variants={{
                          hidden: { opacity: 0, y: 30 },
                          visible: { opacity: 1, y: 0, transition: { delay: idx * 0.07, duration: 0.5 } }
                        }}
                        whileHover={{ scale: 1.03, borderColor: '#3b82f6' }}
                      >
                        <div className="flex flex-row items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${result === 'Win' ? 'bg-blue-600 text-white' : result === 'Loss' ? 'bg-red-500 text-white' : result === 'Draw' ? 'bg-gray-400 text-white' : 'bg-gray-700 text-blue-100'}`}>{result}</span>
                          <span className="text-xs text-blue-400 font-mono ml-2">{game.createdAt ? new Date(game.createdAt).toLocaleDateString() : ''}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row items-center justify-between">
                            <span className="text-sm sm:text-base font-semibold text-blue-100">
                              White: {game.white?.username || '-'}
                            </span>
                            <span className="text-sm sm:text-base font-semibold text-blue-200">
                              {game.whiteRatingAtEnd ?? game.white?.rating ?? '-'}
                            </span>
                          </div>
                          <div className="flex flex-row items-center justify-between">
                            <span className="text-sm sm:text-base font-semibold text-blue-100">
                              Black: {game.black?.username || '-'}
                            </span>
                            <span className="text-sm sm:text-base font-semibold text-blue-200">
                              {game.blackRatingAtEnd ?? game.black?.rating ?? '-'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  });
                })()}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
