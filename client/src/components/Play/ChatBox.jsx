import React, { useContext, useEffect, useRef, useState } from 'react';
import { GameDataContext } from '../../providers/gameDataProvider';
import { useSocket } from '../../providers/socketContext';
import { debounce } from 'lodash';
import { UserDetailsContext } from "../Authentication/AuthRoute";

const ChatBox = () => {
  const socket = useSocket();
  const { gameData } = useContext(GameDataContext);
  const roomId = gameData.roomId;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const { userDetails } = useContext(UserDetailsContext);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const debounceStopTyping = useRef(
    debounce(() => {
      socket.emit('stopTyping', { roomId, username: userDetails.username });
    }, 1000)
  ).current;

  useEffect(() => {
    if (!socket || !roomId || !userDetails?.username) return;

    // Only emit joinRoom if username is defined
    if (userDetails.username) {
      socket.emit('joinRoom', { roomId, username: userDetails.username });
    }

    socket.on('msg-receive', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('userTyping', ({ username }) => {
      setTypingUser(username);
    });

    socket.on('userStopTyping', () => {
      setTypingUser(null);
    });

    return () => {
      socket.off('msg-receive');
      socket.off('userTyping');
      socket.off('userStopTyping');
    };
  }, [socket, roomId, userDetails?.username]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const msg = {
      roomId,
      username: userDetails.username,
      message: newMessage.trim(),
      timestamp: Date.now(),
    };

    socket.emit('sendMessage', msg);
    setNewMessage('');
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    socket.emit('typing', { roomId, username: userDetails.username });
    debounceStopTyping();
  };

  return (
    <div className="bg-secondary-dark p-4 rounded-lg h-64 flex flex-col">
      <span className="text-white text-sm mb-2">
        Chat with {gameData?.opponent?.username || 'Opponent'}
      </span>

      <div className="flex-1 overflow-y-auto mb-2 px-2 space-y-2">
        {messages.map((msg, index) =>
          msg.system ? null : (
            <div
              key={index}
              className={`p-2 max-w-xs rounded-md text-sm ${
                msg.username === userDetails.username
                  ? 'bg-blue-600 text-white ml-auto'
                  : 'bg-gray-200 text-black mr-auto'
              }`}
            >
              <div className="font-semibold text-xs">{msg.username}</div>
              <div>{msg.message}</div>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      {typingUser && typingUser !== userDetails.username && (
        <div className="text-xs text-gray-400 px-2 pb-1">{typingUser} is typing...</div>
      )}

      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 p-2 rounded-lg bg-foreground text-copy text-sm outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-secondary-light text-copy px-3 py-1 rounded-lg border border-secondary-content border-opacity-30 hover:opacity-75 text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;