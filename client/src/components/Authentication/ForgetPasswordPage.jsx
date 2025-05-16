import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import CustomizedSnackbars from '../Snackbar/Snackbar';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState({ open: false, type: '', message: '' });
    const navigate = useNavigate();

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar({ open: false, type: '', message: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setOpenSnackbar({ open: false, type: '', message: '' });
        setIsDisabled(true); // disable button immediately

        try {
            await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/forgot-password`, { email });
            setSubmitted(true);
            setOpenSnackbar({ open: true, type: 'success', message: 'Reset link sent to your email.' });
            // Redirect to login after brief delay
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setIsDisabled(false); // re-enable button on error
            setOpenSnackbar({ open: true, type: 'error', message: err.response?.data?.message || 'Something went wrong' });
        }
    };

    return (
        <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen w-full flex flex-col overflow-hidden">
            {/* Floating background shapes */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-700 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-white opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
            <div className="flex flex-1 items-center justify-center w-full">
                <div className="flex flex-col w-full max-w-lg bg-[#232b3b]/90 rounded-2xl border border-gray-700 shadow-2xl p-10 gap-6 items-center justify-center">
                    <span className="text-blue-100 text-3xl font-bold antialiased text-center mb-2">Forgot Password?</span>
                    <span className="text-blue-200 text-md font-extralight antialiased text-center mb-4">Enter your email and we'll send you a link to reset your password.</span>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            disabled={isDisabled}
                            className="h-12 w-full bg-[#1e293b] text-blue-100 border-2 border-blue-700 rounded-lg px-6 text-md focus:outline-none focus:border-blue-400 transition"
                        />
                        <button
                            type="submit"
                            disabled={isDisabled}
                            className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition text-lg mt-2"
                        >
                            {submitted ? 'Link Sent!' : 'Send Reset Link'}
                        </button>
                    </form>
                    {submitted && (
                        <p className="mt-4 text-sm text-success-content text-center max-w-sm">
                            If the email exists, a reset link has been sent. Redirecting to login...
                        </p>
                    )}

                    <CustomizedSnackbars
                        type={openSnackbar.type}
                        message={openSnackbar.message}
                        open={openSnackbar.open}
                        handleClose={handleCloseSnackbar}
                    />
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
