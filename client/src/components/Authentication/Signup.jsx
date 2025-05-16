import { useFormik } from "formik";
import { signUpSchema } from "../../schemas";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { useState } from "react";
import Loader from "../../utils/Loader";
import CustomizedSnackbars from "../Snackbar/Snackbar";
const inittialValues = {
    username: '',
    email: '',
    password: ''
}

function Signup() {
    const [loading, setLoading] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState({ open: false, type: '', message: '' });


    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar({ open: false, type: '', message: '' });
    };
    const navigate = useNavigate()
    const { values, handleBlur, handleChange, touched, handleSubmit, errors } = useFormik({
        initialValues: inittialValues,
        validationSchema: signUpSchema,
        onSubmit: values => handleSubmitClick(values)
    })

    function handleInputChange(event) {
        handleChange(event);
    }

    async function handleSubmitClick(values) {
        setLoading(true)
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/signup`, {
                username: values.username,
                email: values.email,
                password: values.password
            });
            if (response.status === 201) {
                const responeLogin = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/v1/users/login`, {
                    username: values.username,
                    password: values.password
                }, { withCredentials: true })
                if (responeLogin.status === 200) {
                    setOpenSnackbar({ open: true, type: 'success', message: 'Signup successful, logging you in...' })
                    setTimeout(() => {
                        navigate('/home')
                    }, 1500);
                }
            }
        } catch (error) {
            setOpenSnackbar({ open: true, type: 'error', message: error.response.data.message })
        }
        setLoading(false)
    }

    return (
        <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen w-full flex flex-col overflow-hidden">
            {/* Floating background shapes */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-700 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-white opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
            <div className="flex flex-1 items-center justify-center w-full">
                <div className="flex flex-col md:flex-row w-full max-w-4xl bg-[#232b3b]/90 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                    <div className="flex flex-col justify-center items-center gap-4 w-full md:w-1/2 p-10">
                        <span className="text-blue-100 text-3xl font-bold antialiased text-center">
                            Create your account
                        </span>
                        <span className="text-blue-200 text-md font-extralight antialiased">
                            Create using social networks
                        </span>
                        <div className="flex flex-row gap-5 mb-2">
                            <a href={`${process.env.REACT_APP_SERVER_URL}/api/v1/users/auth/google`} className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-blue-100 transition shadow">
                                <img src="/images/google-icon.png" alt="google-icon" className="w-6 h-6" />
                            </a>
                            <a href={`${process.env.REACT_APP_SERVER_URL}/api/v1/users/auth/github`} className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-blue-100 transition shadow">
                                <img src="/images/github-icon.png" alt="github-icon" className="w-6 h-6" />
                            </a>
                        </div>
                        <div className="flex flex-row items-center justify-center w-full gap-2 mb-2">
                            <div className="flex-1 h-0 border-t border-blue-400" />
                            <span className="text-blue-200">or</span>
                            <div className="flex-1 h-0 border-t border-blue-400" />
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs">
                            <input
                                type="text"
                                name="username"
                                value={values.username}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="Username"
                                className="h-12 w-full bg-[#1e293b] text-blue-100 border-2 border-blue-700 rounded-lg px-6 text-md focus:outline-none focus:border-blue-400 transition"
                            />
                            {errors.username && touched.username && <span className="text-red-400 text-sm">{errors.username}</span>}
                            <input
                                type="email"
                                name="email"
                                value={values.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="Email"
                                className="h-12 w-full bg-[#1e293b] text-blue-100 border-2 border-blue-700 rounded-lg px-6 text-md focus:outline-none focus:border-blue-400 transition"
                            />
                            {errors.email && touched.email && <span className="text-red-400 text-sm">{errors.email}</span>}
                            <input
                                type="password"
                                name="password"
                                value={values.password}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="Password"
                                className="h-12 w-full bg-[#1e293b] text-blue-100 border-2 border-blue-700 rounded-lg px-6 text-md focus:outline-none focus:border-blue-400 transition"
                            />
                            {errors.password && touched.password && <span className="text-red-400 text-sm">{errors.password}</span>}
                            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition text-lg mt-2">
                                Sign Up
                            </button>
                        </form>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#181f2a] to-[#232b3b] w-full md:w-1/2 p-10 gap-4 text-center">
                        <span className="text-white text-3xl font-bold antialiased shadow-2xl">
                            Already have an account?
                        </span>
                        <span className="text-blue-200 font-extralight antialiased max-w-prose shadow-2xl">
                            Sign in to continue your chess journey and connect with friends.
                        </span>
                        <Link to="/login" className="bg-white text-blue-700 rounded-full min-w-40 mt-6 px-8 py-3 font-semibold shadow-2xl text-lg hover:bg-blue-100 transition">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup