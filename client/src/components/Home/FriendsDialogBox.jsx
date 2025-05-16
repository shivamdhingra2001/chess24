import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton } from '@mui/material';
import { FaUserFriends } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoPersonAddSharp } from "react-icons/io5";
import { MdPersonRemove } from "react-icons/md";
import { FaArrowCircleRight } from "react-icons/fa";

export default function FriendsDialog() {
    const [open, setOpen] = React.useState(false);
    const [friends, setFriends] = React.useState([]);
    const [friendRequests, setFriendRequests] = React.useState([]);

    const navigate = useNavigate();

    const handleClickOpen = () => {
        getFriends();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getFriends = async () => {
        try {
            const resFriendRequest = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/getFriendRequests`, { withCredentials: true });
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/getFriends`, { withCredentials: true });
            setFriends(res.data);
            setFriendRequests(resFriendRequest.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddFriendBtn = () => {
        navigate('/addFriend');
        handleClose();
    };

    const addFriend = async (friendId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/acceptFriendRequest`, { friendId }, { withCredentials: true });
            console.log(response.data);
            getFriends();
        } catch (error) {
            console.log(error);
        }
    };

    const removeFriendReq = async (friendId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/removeFriendRequest`, { friendId }, { withCredentials: true });
            console.log(response.data);
            getFriends();
        } catch (error) {
            console.log(error);
        }
    };

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
        handleClose();
    };

    const handleSearchFriends = (event) => {
        try {
            const search = event.target.value.trim();
            if (search !== null || search !== '' || search !== undefined || search.length >= 3) {
                const filteredFriends = friends.filter(friend => friend.username.toLowerCase().includes(search.toLowerCase()));
                setFriends(filteredFriends);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <>
            <IconButton
                aria-label="Friends"
                onClick={handleClickOpen}
            >
                <FaUserFriends style={{ color: 'white' }} />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll='paper'
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                PaperProps={{
                    className: 'rounded-3xl bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-blue-700/70 border border-blue-400/40 shadow-2xl backdrop-blur-xl',
                    style: { minWidth: 420, maxWidth: 540 },
                    sx: {
                        '@media (max-width: 640px)': {
                            minWidth: '90vw',
                            maxWidth: '95vw',
                        },
                    },
                }}
            >
                <DialogTitle id="scroll-dialog-title" style={{ fontWeight: 'bold', color: '#c7e0ff', textAlign: 'center', letterSpacing: 1, fontSize: '1.25rem' }}>
                    <span className="flex flex-row items-center gap-2 justify-center">
                        <FaUserFriends className="text-blue-300 text-xl" /> Your Friends
                    </span>
                </DialogTitle>
                <DialogContent dividers={true} className="bg-transparent">
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                        className="!text-blue-100"
                    >
                        <span className='flex flex-col w-full h-full items-start justify-center'>
                            <span className='m-1 w-full flex justify-center'>
                                <input
                                    type="text"
                                    placeholder='Search by username'
                                    onChange={handleSearchFriends}
                                    maxLength={20}
                                    className='w-full max-w-md h-8 bg-blue-950/60 text-blue-100 border-2 rounded-xl border-blue-400/40 focus:border-blue-400 focus:text-blue-200 transition duration-200 outline-none px-2 text-xs shadow-md placeholder:text-blue-300/60 sm:h-12 sm:px-6 sm:text-lg'
                                />
                            </span>
                            <span className='flex flex-col gap-2 w-full px-1 sm:px-2'>
                                <span className='font-semibold text-base mb-0 text-blue-200 sm:text-xl sm:mb-1'>
                                    Friend Requests
                                </span>
                                {friendRequests.length === 0 ?
                                    <span className='flex flex-col items-center justify-center gap-2 text-blue-300/70 py-1 text-sm sm:gap-4 sm:py-2 sm:text-base'>
                                        You have no friend requests
                                    </span> : friendRequests.map((friend, index) => (
                                        <span key={index} className='flex flex-row w-full items-center justify-between mb-1 bg-blue-800/40 rounded-xl p-1 shadow border border-blue-400/20 sm:p-2 sm:mb-2'>
                                            <span className='flex flex-row items-center gap-2'>
                                                <img src={friend.profilePicture} alt="profile" className='w-6 h-6 rounded-full border-2 border-blue-400 shadow sm:w-10 sm:h-10' />
                                                <span className='text-blue-100 font-semibold text-xs sm:text-base'>{friend.username}</span>
                                            </span>
                                            <span className='flex flex-row items-center justify-center gap-1'>
                                                <IconButton onClick={() => addFriend(friend._id)} className="hover:bg-green-100/10">
                                                    <IoPersonAddSharp style={{ color: 'limegreen' }} size={16} />
                                                </IconButton>
                                                <IconButton onClick={() => removeFriendReq(friend._id)} className="hover:bg-red-100/10">
                                                    <MdPersonRemove style={{ color: 'crimson' }} size={18} />
                                                </IconButton>
                                            </span>
                                        </span>
                                    ))}
                                <span className='flex flex-row justify-between items-center font-semibold text-base text-blue-200 mt-2 mb-0 sm:text-xl sm:mt-4 sm:mb-2'>
                                    Friends
                                    <button onClick={handleAddFriendBtn} className='bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs px-2 py-0.5 rounded-xl shadow hover:scale-105 transition-transform font-bold border border-blue-300/40 sm:text-sm sm:px-4 sm:py-2'>Add Friends</button>
                                </span>
                                {friends.length === 0 ?
                                    <span className='flex flex-col items-center justify-center gap-2 text-blue-300/70 py-1 text-sm sm:gap-4 sm:py-2 sm:text-base'>
                                        You haven\'t added any friends yet
                                    </span> : friends.map((friend, index) => (
                                        <span key={index} onClick={() => handleUserClick(friend._id)} className='flex flex-row items-center justify-between w-full bg-blue-800/40 border border-blue-400/20 px-2 h-10 rounded-xl cursor-pointer hover:opacity-90 hover:bg-blue-700/40 transition-all duration-150 shadow group sm:px-4 sm:h-14'>
                                            <span className='flex flex-row items-center w-full gap-2'>
                                                <img src={friend.profilePicture} alt="profile" className='w-6 h-6 rounded-full border-2 border-blue-400 shadow sm:w-10 sm:h-10' />
                                                <span className='text-blue-100 font-semibold text-xs sm:text-base'>{friend.username}</span>
                                            </span>
                                            <FaArrowCircleRight className="text-blue-300 text-base group-hover:text-blue-400 transition-colors sm:text-xl" />
                                        </span>
                                    ))}
                            </span>
                        </span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="bg-transparent flex justify-center pb-2 sm:pb-4">
                    <Button onClick={handleClose} className='bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold rounded-xl px-3 py-0.5 shadow hover:scale-105 transition-transform border border-blue-300/40 text-xs sm:px-6 sm:py-2 sm:text-base'>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}