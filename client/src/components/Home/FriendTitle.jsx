import axios from 'axios';
import React from 'react'
import { IoPersonAddSharp } from "react-icons/io5";
import CustomizedSnackbars from '../Snackbar/Snackbar';
function FriendTitle({ friend }) {
    const [openSnackbar, setOpenSnackbar] = React.useState({ open: false, type: '', message: '' })
    const handleCloseSnackbar = () => {
        setOpenSnackbar({ ...openSnackbar, open: false })
    }
    const handleAddFriend = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/sendFriendRequest`, { friendId: friend._id }, { withCredentials: true })
            setOpenSnackbar({ open: true, type: 'success', message: response.data.message })
        } catch (error) {
            setOpenSnackbar({ open: true, type: 'error', message: error.response.data.message })
        }
    }
    return (<>
        <div className="flex flex-row items-center justify-between w-full p-5 my-4 bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-blue-700/70 border border-blue-400/40 shadow-2xl rounded-3xl backdrop-blur-xl transition-transform hover:scale-105 hover:shadow-blue-400/30 group">
            <div className="flex flex-row items-center gap-5">
                <img src={friend.profilePicture} alt="profile" className="w-16 h-16 rounded-full border-4 border-blue-400 shadow-lg bg-blue-950/70 object-cover group-hover:border-blue-300 transition-all duration-200" />
                <div className="flex flex-col">
                    <span className="font-extrabold text-2xl text-blue-100 mb-1 drop-shadow group-hover:text-blue-200 transition-colors duration-200">
                        {friend.username}
                    </span>
                    <span className="font-semibold text-lg text-blue-300 group-hover:text-blue-200 transition-colors duration-200">
                        Elo: {friend.rating}
                    </span>
                </div>
            </div>

            <button
                onClick={handleAddFriend}
                className="flex flex-row items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold rounded-full px-7 py-2.5 shadow-lg border border-blue-300/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/60 text-lg group-hover:scale-110"
            >
                <IoPersonAddSharp className="text-2xl" />
                Add Friend
            </button>
        </div>
        {openSnackbar && <CustomizedSnackbars type={openSnackbar.type} message={openSnackbar.message} open={openSnackbar.open} handleClose={handleCloseSnackbar} />}
    </>
    )
}
export default FriendTitle