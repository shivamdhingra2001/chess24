import { useFormik } from "formik";
import { signInSchema } from "../../schemas";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useState } from "react";
import CustomizedSnackbars from "../Snackbar/Snackbar";
import { Link } from "react-router-dom";
const inittialValues = {
  username: "",
  password: "",
};

function Login() {
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    type: "",
    message: "",
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar({ open: false, type: "", message: "" });
  };

  const navigate = useNavigate();
  const handleLogin = async ({ username, password }) => {
    setOpenSnackbar({ open: false, type: "", message: "" });
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/users/login`,
        { username, password },
        { withCredentials: true }
      );
      setOpenSnackbar({
        open: true,
        type: "success",
        message: "Logged in successfully, redirecting...",
      });
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      console.log(err.response.data.message);
      setOpenSnackbar({
        open: true,
        type: "error",
        message: err.response.data.message,
      });
    }
  };

  const { values, handleBlur, touched, handleChange, handleSubmit, errors } =
    useFormik({
      initialValues: inittialValues,
      validationSchema: signInSchema,
      onSubmit: (values) => handleLogin(values),
    });

  function handleInputChange(event) {
    handleChange(event);
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
              Login to your account
            </span>
            <span className="text-blue-200 text-md font-extralight antialiased">
              Login using social networks
            </span>
            <div className="flex flex-row gap-5">
              <a
                href={`${process.env.REACT_APP_SERVER_URL}/api/v1/users/auth/google`}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-blue-100 transition shadow"
              >
                <img
                  src="/images/google-icon.png"
                  alt="google-icon"
                  className="w-6 h-6"
                />
              </a>
              <a
                href={`${process.env.REACT_APP_SERVER_URL}/api/v1/users/auth/github`}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-blue-100 transition shadow"
              >
                <img
                  src="/images/github-icon.png"
                  alt="github-icon"
                  className="w-6 h-6"
                />
              </a>
            </div>
            <div className="flex flex-row items-center justify-center w-full gap-2 mb-2">
              <div className="flex-1 h-0 border-t border-blue-400" />
              <span className="text-blue-200">or</span>
              <div className="flex-1 h-0 border-t border-blue-400" />
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full max-w-xs"
            >
              <input
                type="text"
                name="username"
                value={values.username}
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Username"
                className="h-12 w-full bg-[#1e293b] text-blue-100 border-2 border-blue-700 rounded-lg px-6 text-md focus:outline-none focus:border-blue-400 transition"
              />
              {errors.username && touched.username && (
                <span className="text-red-400 text-sm">{errors.username}</span>
              )}
              <input
                type="password"
                name="password"
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="Password"
                className="h-12 w-full bg-[#1e293b] text-blue-100 border-2 border-blue-700 rounded-lg px-6 text-md focus:outline-none focus:border-blue-400 transition"
              />
              {errors.password && touched.password && (
                <span className="text-red-400 text-sm">{errors.password}</span>
              )}
              <div className="text-right mt-1">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition text-lg mt-2"
              >
                Sign In
              </button>
            </form>
          </div>
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#181f2a] to-[#232b3b] w-full md:w-1/2 p-10 gap-4 text-center">
            <span className="text-white text-3xl font-bold antialiased shadow-2xl">
              New here?
            </span>
            <span className="text-blue-200 font-extralight antialiased max-w-prose shadow-2xl">
              Join the fray and let the games begin! Embark on an epic chess
              adventure where every move promises a thrilling experience.
            </span>
            <div className="flex gap-4">
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition text-lg"
              >
                Signup
              </Link>
              <Link
                to="/login"
                className="border border-blue-400 text-blue-200 px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 hover:text-white transition text-lg"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background w-1/12">
        {openSnackbar && (
          <CustomizedSnackbars
            type={openSnackbar.type}
            message={openSnackbar.message}
            open={openSnackbar.open}
            handleClose={handleCloseSnackbar}
          />
        )}
      </div>
    </div>
  );
}

export default Login;
