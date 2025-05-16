import MiniDrawer from "../Home/Minidrawer";
import { motion } from "framer-motion";
import { FaBolt, FaSync, FaComments, FaChartLine, FaMobileAlt, FaReact, FaNodeJs, FaDatabase } from "react-icons/fa";
import { SiSocketdotio } from "react-icons/si";

function AboutUs() {
    const headingUnderline = "after:content-[''] after:block after:h-1 after:w-16 after:bg-gradient-to-r after:from-blue-400 after:to-blue-700 after:rounded-full after:mt-1 after:mx-0";
    return (
        <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen w-full flex flex-row text-white overflow-hidden">
            {/* Floating background shapes */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-700 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-white opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
            <MiniDrawer />
            <div className="flex flex-col w-full px-2 sm:px-6 md:px-20 py-8 sm:py-12 md:py-20 mt-9 lg:mt-0 gap-6 sm:gap-10 z-10">
                {/* Heading */}
                <motion.h1 
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-100 drop-shadow mb-2 text-center break-words"
                    initial={{ opacity: 0, y: -30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
                >
                    About Chess24
                </motion.h1>
                <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mb-2 animate-pulse mx-auto" />
                {/* Description */}
                <motion.p 
                    className="text-base sm:text-lg leading-relaxed text-blue-100 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.7 }}
                >
                    <strong>Chess24</strong> is a modern, real-time, bidirectional chess application built on the MERN stack. 
                    It enables players from around the world to play live chess games with instant updates and integrated live chat, 
                    ensuring a seamless and interactive gameplay experience.
                </motion.p>
                {/* Key Features */}
                <motion.section 
                    className="mt-2 sm:mt-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7, type: 'spring', stiffness: 60 }}
                    viewport={{ once: true }}
                >
                    <h2 className={`text-xl sm:text-2xl font-semibold text-blue-200 mb-2 text-center ${headingUnderline}`}>Key Features</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-blue-100">
                        <li className="flex items-start gap-3 bg-[#232b3b]/80 rounded-xl p-4 border border-gray-700 shadow hover:shadow-blue-700/30 transition-all duration-200">
                            <FaBolt className="text-teal-400 mt-1" />
                            Real-time multiplayer chess matches
                        </li>
                        <li className="flex items-start gap-3 bg-[#232b3b]/80 rounded-xl p-4 border border-gray-700 shadow hover:shadow-blue-700/30 transition-all duration-200">
                            <FaSync className="text-teal-400 mt-1" />
                            Bi-directional game state sync with WebSockets
                        </li>
                        <li className="flex items-start gap-3 bg-[#232b3b]/80 rounded-xl p-4 border border-gray-700 shadow hover:shadow-blue-700/30 transition-all duration-200">
                            <FaComments className="text-teal-400 mt-1" />
                            Live in-game chat for communication
                        </li>
                        <li className="flex items-start gap-3 bg-[#232b3b]/80 rounded-xl p-4 border border-gray-700 shadow hover:shadow-blue-700/30 transition-all duration-200">
                            <FaChartLine className="text-teal-400 mt-1" />
                            Elo-based matchmaking system (coming soon)
                        </li>
                        <li className="flex items-start gap-3 bg-[#232b3b]/80 rounded-xl p-4 border border-gray-700 shadow hover:shadow-blue-700/30 transition-all duration-200">
                            <FaMobileAlt className="text-teal-400 mt-1" />
                            Fully responsive design for all devices
                        </li>
                    </ul>
                </motion.section>
                {/* Technology Stack */}
                <motion.section 
                    className="mt-4 sm:mt-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7, type: 'spring', stiffness: 60 }}
                    viewport={{ once: true }}
                >
                    <h2 className={`text-xl sm:text-2xl font-semibold text-blue-200 mb-2 text-center ${headingUnderline}`}>Technology Stack</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-blue-100">
                        <li className="flex items-center gap-3 bg-[#232b3b]/80 rounded-xl p-4 border border-gray-700 shadow hover:shadow-blue-700/30 transition-all duration-200"><FaReact className="text-sky-400" /> React.js + Tailwind CSS (Frontend)</li>
                        <li className="flex items-center gap-3 bg-[#232b3b]/80 rounded-xl p-4 border border-gray-700 shadow hover:shadow-blue-700/30 transition-all duration-200"><FaNodeJs className="text-green-400" /> Node.js with Express (Backend)</li>
                        <li className="flex items-center gap-3 bg-[#232b3b]/80 rounded-xl p-4 border border-gray-700 shadow hover:shadow-blue-700/30 transition-all duration-200"><FaDatabase className="text-yellow-400" /> MongoDB (Database)</li>
                        <li className="flex items-center gap-3 bg-[#232b3b]/80 rounded-xl p-4 border border-gray-700 shadow hover:shadow-blue-700/30 transition-all duration-200"><SiSocketdotio className="text-purple-400" /> Socket.IO (Real-time communication)</li>
                    </ul>
                </motion.section>
                {/* Vision */}
                <motion.section 
                    className="mt-4 sm:mt-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.7, type: 'spring', stiffness: 60 }}
                    viewport={{ once: true }}
                >
                    <h2 className={`text-xl sm:text-2xl font-semibold text-blue-200 mb-2 text-center ${headingUnderline}`}>Our Vision</h2>
                    <p className="text-blue-100 text-center">
                        Chess24 is designed not just to simulate a chess game, but to bring players closer through 
                        seamless real-time interaction. We believe that chess should be accessible, social, and 
                        technologically advanced — bridging tradition with innovation.
                    </p>
                </motion.section>
                {/* Contact */}
                <motion.section 
                    className="mt-4 sm:mt-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7, type: 'spring', stiffness: 60 }}
                    viewport={{ once: true }}
                >
                    <h2 className={`text-xl sm:text-2xl font-semibold text-blue-200 mb-2 text-center ${headingUnderline}`}>Connect With Us</h2>
                    <p className="text-blue-100 text-center">
                        Have suggestions or want to contribute? Reach out to us on GitHub or send us an email at{' '}
                        <motion.a
                            href="mailto:support@chess24.app"
                            className="text-blue-400 underline cursor-pointer hover:text-blue-300 transition font-semibold"
                            whileHover={{ scale: 1.08, color: "#60a5fa" }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            support@chess24.app
                        </motion.a>
                    </p>
                </motion.section>
            </div>
        </div>
    );
}

export default AboutUs;
