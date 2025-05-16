import Lottie from "lottie-react";
import MiniDrawer from "./Minidrawer";
import { useState } from "react";
import axios from "axios";
import FriendTitle from "./FriendTitle";
const friendshipChessQuotes = [
    "In the game of chess and life, a true friend is like a faithful bishop, moving diagonally to protect you, staying close, and always valuing the depth of the board.",
    "Friendship is like a game of chess: with each move, you learn more about each other, plan your future moves together, and protect one another against the adversities of life.",
    "Much like in chess, a friend is someone who sees your board from a different perspective, guides you through complex moves, and stands by you till the end of the game.",
    "In life's chessboard, friends are the knights who leap over obstacles, defending and supporting you in unexpected and invaluable ways.",
    "True friendship is like playing a good game of chess – it requires patience, strategy, and respecting each other's moves, no matter the outcome of the game.",
    "The bond of friendship is much like a game of chess – it requires two players who equally understand the importance of every move and the value of every piece on the board.",
    "A friend in life is like a pawn in chess: their journey may seem straightforward, but their presence is crucial, and their potential to become something greater is always there.",
    "Just as a chess game is incomplete without all its pieces, life is incomplete without friends who add different dimensions to our journey, each with their unique role and significance.",
    "In the intricate chess game of life, a good friend is like a strategic queen move – powerful, decisive, and always there when you need them the most.",
    "Chess teaches us that every piece has its unique role, just as every friend in our life plays an irreplaceable role, making our journey complete and meaningful."
];
const randomIdx = Math.floor(Math.random() * friendshipChessQuotes.length);

function Home(props) {
    const [friends, setFriends] = useState([])
    const handleSearch = async (event) => {
        if (event.target.value.length < 3) {
            setFriends([])
            return
        }

        try {
            const search = event.target.value.trim();
            if (search !== null || search !== '' || search !== undefined || search.length >= 3) {
                const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/searchByUsername`, { username: search }, { withCredentials: true })
                setFriends(response.data)
            }
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#2563eb] min-h-screen w-full flex flex-row overflow-hidden">
            {/* Floating background shapes */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-700 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-white opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
            <MiniDrawer />
            <div className="flex flex-col items-start justify-start w-full px-20 py-28 gap-6 z-10">
                <span className="text-3xl font-bold text-blue-100 mb-2 drop-shadow">Add Friends</span>
                <div className="flex flex-col w-full items-center justify-center mb-8">
                    <input
                        type="text"
                        placeholder='Search by username'
                        maxLength={20}
                        onChange={handleSearch}
                        className='w-3/5 h-12 bg-[#1e293b] text-blue-100 border-2 border-blue-700 rounded-lg px-6 text-lg focus:outline-none focus:border-blue-400 transition shadow'
                    />
                </div>
                <div className="flex flex-col w-full items-center justify-center gap-4">
                    {friends.length === 0 ? (
                        <span className="text-blue-300 text-lg font-light mt-4">No users found. Try searching for a username.</span>
                    ) : (
                        friends.map(friend => (
                            <FriendTitle key={friend._id} friend={friend} />
                        ))
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center justify-center w-full px-20 py-28 gap-6 z-10">
                <div className="w-80 h-80 flex items-center justify-center">
                    <Lottie animationData={require('../../utils/friends.json')} />
                </div>
                <span className="font-quote text-xl text-blue-200 text-center max-w-lg bg-[#1e293b]/80 rounded-xl p-6 border border-blue-700 shadow">
                    {friendshipChessQuotes[randomIdx]}
                </span>
            </div>
        </div>
    )
}

export default Home