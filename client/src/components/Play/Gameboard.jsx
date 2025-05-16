import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import ChatBox from './ChatBox';
import Username from './Username';
import Sidebar from './Sidebar';
import CustomizedSnackbars from '../Snackbar/Snackbar';
import ResultDialog from './ResultDialog';
import ConfirmationDialog from './ConfirmationDialog';
import { useSocket } from '../../providers/socketContext';
import { GameDataContext } from '../../providers/gameDataProvider';
import { UserDetailsContext } from '../Authentication/AuthRoute';

function Gameboard() {
  const socket = useSocket();
  const { roomId } = useParams();
  const { gameData } = useContext(GameDataContext);
  const { userDetails } = useContext(UserDetailsContext);

  const gameRef = useRef(new Chess());
  const [fen, setFen] = useState(gameRef.current.fen());
  const [time, setTime] = useState({ w: 0, b: 0 });
  const [activeColor, setActiveColor] = useState('w');
  const timerRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState({ show: false, message: '', type: '' });
  const [gameOver, setGameOver] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [promotion, setPromotion] = useState({ show: false, ssquare: null, tsquare: null });
  const [drawRequest, setDrawRequest] = useState({ show: false, userId: null });
  const [lastMoveSquares, setLastMoveSquares] = useState({ from: null, to: null });
  const [moveSquares, setMoveSquares] = useState({});
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [orientation, setOrientation] = useState('white');
  const [showChat, setShowChat] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (gameData) {
      gameRef.current.load(gameData.fen);
      setFen(gameRef.current.fen());
      setTime({ w: Math.floor(gameData.timew), b: Math.floor(gameData.timeb) });
      setOrientation(gameData.color);
      setActiveColor(gameRef.current.turn());
      setIsLoading(false);
      if (gameData.over) {
        setGameOver(true);
        setResultMessage(gameData.resultMessage || 'Game Over');
      }
    }
  }, [gameData]);

  const [timerExpired, setTimerExpired] = useState(false);
  const prevActiveColor = useRef(activeColor);
  const prevGameOver = useRef(gameOver);

  useEffect(() => {
    if (gameOver || isLoading) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTime((prev) => {
        if (gameOver) return prev;
        const color = activeColor;
        if (prev[color] > 0) {
          return { ...prev, [color]: prev[color] - 1 };
        } else if (!timerExpired) {
          setTimerExpired(true);
          setGameOver(true);
          const loserColor = color === 'w' ? 'white' : 'black';
          const winner = loserColor === 'white' ? 'Black' : 'White';
          setResultMessage(`${winner} wins by timeout`);
          socket.emit('timeoutLoss', { roomId, loserColor });
          return prev;
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [activeColor, gameOver, isLoading, timerExpired, socket, roomId]);

  useEffect(() => {
    if (!gameOver && timerExpired) setTimerExpired(false);
  }, [gameOver, timerExpired]);

  useEffect(() => {
    if (prevActiveColor.current !== activeColor || prevGameOver.current !== gameOver) {
      prevActiveColor.current = activeColor;
      prevGameOver.current = gameOver;
    }
  }, [activeColor, gameOver]);

  const makeMove = (moveObj) => {
    try {
      const move = gameRef.current.move(moveObj);
      if (move) {
        setFen(gameRef.current.fen());
        setLastMoveSquares({ from: move.from, to: move.to });
        setActiveColor(gameRef.current.turn());
        if (gameRef.current.isGameOver()) {
          setGameOver(true);
          setResultMessage('Checkmate! You Won');
        }
        return move;
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const onDrop = (sourceSquare, targetSquare) => {
    if (gameOver) return false;

    const piece = gameRef.current.get(sourceSquare);
    if (gameRef.current.turn() !== gameData.color[0]) {
      setError({ show: true, message: 'Not your turn', type: 'error' });
      return false;
    }

    if (promotion.show) {
      setPromotion({ show: false, ssquare: null, tsquare: null });
    } else if (
      piece?.type === 'p' &&
      ((piece.color === 'w' && targetSquare[1] === '8') || (piece.color === 'b' && targetSquare[1] === '1'))
    ) {
      setPromotion({ show: true, ssquare: sourceSquare, tsquare: targetSquare });
      return false;
    }

    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move) {
      setSelectedSquare(null);
      setMoveSquares({});
      socket.emit('move', {
        roomId,
        userId: userDetails._id,
        move: gameRef.current.fen(),
        color: gameData.color,
      });
    }

    return !!move;
  };

  const handlePromotion = (piece) => {
    const move = makeMove({
      from: promotion.ssquare,
      to: promotion.tsquare,
      promotion: piece,
    });
    if (move) {
      socket.emit('move', {
        roomId,
        userId: userDetails._id,
        move: gameRef.current.fen(),
        color: gameData.color,
      });
    }
    setPromotion({ show: false, ssquare: null, tsquare: null });
  };

  const handleOpponentMove = ({ move, timew, timeb }) => {
    gameRef.current.load(move);
    setFen(gameRef.current.fen());
    const history = gameRef.current.history({ verbose: true });
    const lastMove = history[history.length - 1];
    if (lastMove) {
      setLastMoveSquares({ from: lastMove.from, to: lastMove.to });
    }
    setTime({ w: Math.floor(timew), b: Math.floor(timeb) });
    setActiveColor(gameRef.current.turn());
    if (gameRef.current.isCheckmate()) {
      setGameOver(true);
      const loserColor = gameRef.current.turn() === 'w' ? 'white' : 'black';
      const winner = loserColor === 'white' ? 'Black' : 'White';
      setResultMessage(`Checkmate! ${winner} wins`);
    }
  };

  useEffect(() => {
    socket.on('move', handleOpponentMove);
    socket.on('opponentResigned', () => {
      setGameOver(true);
      setResultMessage('Opponent Resigned. You won.');
    });
    socket.on('drawRequest', ({ userId }) => setDrawRequest({ show: true, userId }));
    socket.on('drawOccurred', () => {
      setGameOver(true);
      setResultMessage('The game is a draw.');
    });
    socket.on('drawRejected', () => {
      setError({ show: true, message: 'Your draw request was rejected', type: 'info' });
    });
    socket.on('timeoutLoss', ({ loserColor }) => {
      setGameOver(true);
      const winner = loserColor === 'white' ? 'Black' : 'White';
      setResultMessage(`${winner} wins by timeout.`);
    });

    return () => {
      socket.off('move');
      socket.off('opponentResigned');
      socket.off('drawRequest');
      socket.off('drawOccurred');
      socket.off('drawRejected');
      socket.off('timeoutLoss');
    };
  }, [socket]);

  useEffect(() => {
    socket.emit('joinRoom', { roomId });
  }, [socket, roomId]);

  const handleDraw = () => {
    socket.emit('draw', { roomId, userId: userDetails._id });
  };

  const handleConfirmDraw = (accept) => {
    socket.emit('confirmDraw', { roomId, userId: drawRequest.userId, accept });
    setDrawRequest({ show: false, userId: null });
    if (accept) {
      setGameOver(true);
      setResultMessage('The game is a draw.');
    }
  };

  const handleResign = () => {
    setGameOver(true);
    socket.emit('resign', { roomId });
    setResultMessage('You have resigned. Your opponent wins.');
  };

  const onMouseOverSquare = (square) => {
    if (selectedSquare) return;
    const moves = gameRef.current.moves({ square, verbose: true });
    if (moves.length === 0) return;

    const squaresToHighlight = {};
    moves.forEach((move) => {
      squaresToHighlight[move.to] = {
        background: 'radial-gradient(circle, rgba(255, 230, 0, 0.4) 30%, transparent 35%)',
        borderRadius: '50%',
      };
    });
    setMoveSquares(squaresToHighlight);
  };

  const onMouseOutSquare = () => {
    if (!selectedSquare) setMoveSquares({});
  };

  const onSquareClick = (square) => {
    if (gameOver) return;
    const piece = gameRef.current.get(square);

    if (piece && piece.color === gameData.color[0]) {
      setSelectedSquare(square);
      const moves = gameRef.current.moves({ square, verbose: true });
      const squaresToHighlight = {};
      moves.forEach((move) => {
        squaresToHighlight[move.to] = {
          background: 'radial-gradient(circle, rgba(255, 230, 0, 0.4) 30%, transparent 35%)',
          borderRadius: '50%',
        };
      });
      setMoveSquares(squaresToHighlight);
    } else {
      setSelectedSquare(null);
      setMoveSquares({});
    }
  };

  const handleTimeout = () => {
    if (!gameOver) {
      setGameOver(true);
      const loserColor = gameRef.current.turn() === 'w' ? 'white' : 'black';
      const winner = loserColor === 'white' ? 'Black' : 'White';
      setResultMessage(`${winner} wins by timeout`);
      socket.emit('timeoutLoss', { roomId, loserColor });
    }
  };

  const timerBox = (label, time, isActive) => (
    <div
      className={`flex flex-col items-center px-2 sm:px-3 md:px-4 py-1 rounded-lg shadow-md
        ${isActive ? 'bg-[#2b2c26] border border-[#e0b432]' : 'bg-[#2b2c26] border border-[#3d3e38]'} 
        transition-all duration-300 w-full max-w-[120px] sm:max-w-[140px] md:max-w-[160px]`}
    >
      <span className={`text-[10px] sm:text-xs font-medium uppercase ${isActive ? 'text-[#e0b432]' : 'text-[#b0b1a8]'}`}>
        {label}
      </span>
      <span
        className={`text-lg sm:text-xl md:text-2xl font-mono font-semibold 
          ${isActive ? 'text-white' : 'text-[#b0b1a8]'} 
          rounded-md px-2 py-0.5 mt-0.5 transition-all duration-300`}
      >
        {typeof time === 'number' && !isNaN(time) && time >= 0
          ? `${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`
          : '--:--'}
      </span>
    </div>
  );

  const whiteTimer = timerBox('White', time.w, activeColor === 'w');
  const blackTimer = timerBox('Black', time.b, activeColor === 'b');

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-[#1e1e1e]">
      <div className="w-12 h-12 border-4 border-[#e0b432] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[#d3d4cc] mt-4 text-lg font-medium">Loading game...</p>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row items-stretch justify-center bg-[#1e1e1e] min-h-screen w-full">
      {/* Sidebar (hidden on mobile and medium screens) */}
      <div className="hidden lg:block lg:w-16 xl:w-20 bg-[#2b2c26] h-full">
        <Sidebar />
      </div>

      {/* Main game container */}
      <div className="flex flex-col lg:flex-row w-full h-full max-w-[1400px] mx-auto">
        {/* Player info and board column */}
        <div className="flex flex-col w-full lg:w-3/4 h-full">
          {/* Opponent info */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center px-3 sm:px-4 py-2 bg-[#2b2c26] border-b border-[#3d3e38]">
            <div className="flex-1 flex justify-start">
              <Username {...gameData.opponent} />
            </div>
            <div className="flex-1 flex justify-end">
              {gameData.color !== 'white' ? whiteTimer : blackTimer}
            </div>
          </div>

          {/* Chessboard - Centered on small and medium screens */}
          <div className="flex items-center justify-center w-full p-2 sm:p-4 md:p-6 lg:p-8 relative">
            {promotion.show && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-20 bg-black bg-opacity-70">
                <div className="grid grid-row-4 border-2 border-[#3d3e38] rounded-md overflow-hidden shadow-lg">
                  <div
                    onClick={() => handlePromotion('q')}
                    className="bg-[#f0d9b5] w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center hover:bg-[#e0b432] cursor-pointer transition-colors"
                  >
                    <img src="/images/chess/qw.png" alt="Queen" className="w-10 sm:w-12 h-10 sm:h-12" />
                  </div>
                  <div
                    onClick={() => handlePromotion('r')}
                    className="bg-[#b58863] w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center hover:bg-[#e0b432] cursor-pointer transition-colors"
                  >
                    <img src="/images/chess/rw.png" alt="Rook" className="w-10 sm:w-12 h-10 sm:h-12" />
                  </div>
                  <div
                    onClick={() => handlePromotion('b')}
                    className="bg-[#f0d9b5] w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center hover:bg-[#e0b432] cursor-pointer transition-colors"
                  >
                    <img src="/images/chess/bw.png" alt="Bishop" className="w-10 sm:w-12 h-10 sm:h-12" />
                  </div>
                  <div
                    onClick={() => handlePromotion('n')}
                    className="bg-[#b58863] w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center hover:bg-[#e0b432] cursor-pointer transition-colors"
                  >
                    <img src="/images/chess/nw.png" alt="Knight" className="w-10 sm:w-12 h-10 sm:h-12" />
                  </div>
                </div>
              </div>
            )}

            <div
              className={`w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[60vmin] lg:max-w-[65vmin] mx-auto transition-opacity duration-300 ${
                promotion.show ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <div className="aspect-square shadow-lg rounded-md overflow-hidden border border-[#3d3e38]">
                <Chessboard
                  position={fen}
                  boardOrientation={orientation}
                  customDarkSquareStyle={{ backgroundColor: '#b58863' }}
                  customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
                  animationDuration={250}
                  onPieceDrop={onDrop}
                  onSquareClick={onSquareClick}
                  customSquareStyles={{
                    ...moveSquares,
                    ...(lastMoveSquares.from && {
                      [lastMoveSquares.from]: { backgroundColor: 'rgba(255, 230, 0, 0.3)' },
                    }),
                    ...(lastMoveSquares.to && {
                      [lastMoveSquares.to]: { backgroundColor: 'rgba(255, 230, 0, 0.3)' },
                    }),
                  }}
                  isDraggablePiece={({ sourceSquare }) =>
                    !gameOver && gameRef.current.turn() === gameData.color[0]
                  }
                  onMouseOverSquare={onMouseOverSquare}
                  onMouseOutSquare={onMouseOutSquare}
                />
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center px-3 sm:px-4 py-2 bg-[#2b2c26] border-t border-[#3d3e38]">
            <div className="flex-1 flex justify-start">
              <Username {...userDetails} />
            </div>
            <div className="flex-1 flex justify-end">
              {gameData.color === 'white' ? whiteTimer : blackTimer}
            </div>
          </div>
        </div>

        {/* Right sidebar with game controls and chat (visible on large screens) */}
        <div className="hidden lg:flex lg:flex-col lg:w-1/4 h-full bg-[#2b2c26] border-l border-[#3d3e38]">
          <div className="flex flex-col gap-3 p-4 border-b border-[#3d3e38]">
            <h3 className="text-[#d3d4cc] text-lg font-medium mb-2">Game Controls</h3>
            <div className="flex flex-col gap-2">
              <button
                className="bg-[#4a4b44] hover:bg-[#5a5b54] text-[#d3d4cc] rounded-md px-4 py-2 font-medium transition-colors flex items-center justify-center gap-2"
                onClick={handleDraw}
              >
                <span className="text-lg">½</span>
                <span>Offer Draw</span>
              </button>
              <button
                className="bg-[#4a4b44] hover:bg-[#5a5b54] text-[#d3d4cc] rounded-md px-4 py-2 font-medium transition-colors flex items-center justify-center gap-2"
                onClick={handleResign}
              >
                <span className="text-lg">🏳️</span>
                <span>Resign</span>
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-hidden">
            <h3 className="text-[#d3d4cc] text-lg font-medium mb-2">Chat</h3>
            <div className="h-full max-h-[calc(100vh-300px)] overflow-y-auto rounded-md bg-[#2b2c26] border border-[#3d3e38]">
              <ChatBox />
            </div>
          </div>
        </div>
      </div>

      {/* Game controls and chat toggle for mobile and medium screens (bottom-right) */}
      <div className="lg:hidden fixed bottom-4 right-4 flex flex-col items-center gap-2 z-30">
        <button
          className="bg-[#4a4b44] bg-opacity-80 hover:bg-[#5a5b54] text-[#d3d4cc] rounded-full p-2 sm:p-3 shadow-md transition-colors"
          onClick={handleDraw}
        >
          <span className="text-lg sm:text-xl">½</span>
        </button>
        <button
          className="bg-[#4a4b44] bg-opacity-80 hover:bg-[#5a5b54] text-[#d3d4cc] rounded-full p-2 sm:p-3 shadow-md transition-colors"
          onClick={handleResign}
        >
          <span className="text-lg sm:text-xl">🏳️</span>
        </button>
        <button
          className="bg-[#4a4b44] bg-opacity-80 hover:bg-[#5a5b54] text-[#d3d4cc] rounded-full p-2 sm:p-3 shadow-md transition-colors"
          onClick={() => setShowChat(!showChat)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 sm:h-6 w-5 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>

      {/* Mobile and medium screen chat overlay */}
      {showChat && (
        <div className="lg:hidden fixed inset-0 z-30 bg-[#1e1e1e] bg-opacity-95 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#d3d4cc] text-lg font-medium">Chat</h3>
            <button
              className="text-[#d3d4cc] p-2 rounded-full hover:bg-[#3d3e38] transition-colors"
              onClick={() => setShowChat(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto rounded-md bg-[#2b2c26] border border-[#3d3e38] p-2">
            <ChatBox />
          </div>
        </div>
      )}

      {/* Notifications and dialogs */}
      {error.show && (
        <CustomizedSnackbars
          open={error.show}
          type={error.type}
          message={error.message}
          handleClose={(event, reason) => {
            if (reason !== 'clickaway') {
              setError({ show: false, type: '', message: '' });
            }
          }}
        />
      )}
      <ResultDialog
        open={gameOver}
        resultMessage={resultMessage}
        handleClose={() => {
          setGameOver(false);
          navigate('/home');
        }}
      />
      <ConfirmationDialog
        open={drawRequest.show}
        message="Your opponent has requested a draw. Do you accept?"
        onConfirm={() => handleConfirmDraw(true)}
        onCancel={() => handleConfirmDraw(false)}
      />
    </div>
  );
}

export default Gameboard;