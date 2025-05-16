import { BrowserRouter, Route, Routes } from "react-router-dom";
import MaxWidthWrapper from "./utils/MaxWidthWrapper";
import LandingPage from "./components/Home/LandingPage";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import Home from "./components/Home/Home";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./utils/Theme";
import Play from "./components/Play/Play";
import Gameboard from "./components/Play/Gameboard";
import { AuthRoute } from "./components/Authentication/AuthRoute";
import AddFriend from "./components/Home/AddFriend";
import ProfilePage from "./components/UserProfile/ProfilePage";
import ContactUs from "./components/DevPages/ContactUs";
import PrivacyPolicy from "./components/DevPages/PrivacyPolicy";
import Feedback from "./components/DevPages/Feedback";
import AboutUs from "./components/DevPages/AboutUs";
import Tournaments from "./components/Tournaments/Tournaments";
import Learn from "./components/Learn/Learn";
import { SocketProvider } from "./providers/socketContext";
import { GameDataProvider } from "./providers/gameDataProvider";
import Playwb from "./components/Play/Playwb";
import Cancel from "./components/Payment/Cancel";
import Success from "./components/Payment/Success";
import CourseContent from "./components/Course/CourseContent";
import CourseDetail from "./components/Course/CourseDetail";
import ForgotPasswordPage from "./components/Authentication/ForgetPasswordPage";
import ResetPassword from "./components/Authentication/ResetPassword";
import Playwf from "./components/Play/Playwf";
import PlayWithFriendRoom from "./components/Play/PlayWithFriendRoom";
import { useEffect } from "react";


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <MaxWidthWrapper>
        <SocketProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/playwb" element={<Playwb />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              {/* Authenticated Routes */}
              <Route path="/home" element={<AuthRoute><Home /></AuthRoute>} />
              
              <Route path="/play" element={<AuthRoute><GameDataProvider><Play /></GameDataProvider></AuthRoute>} /> 
              <Route path="/playwf" element={<AuthRoute><Playwf /></AuthRoute>} />
              <Route path="/play/:roomId" element={<AuthRoute><GameDataProvider><Gameboard /></GameDataProvider></AuthRoute>} />
              <Route path="/addFriend" element={<AuthRoute><AddFriend /></AuthRoute>} />
              <Route path="/profile/:id" element={<AuthRoute><ProfilePage /></AuthRoute>} />
              <Route path="/tournaments" element={<AuthRoute><Tournaments /></AuthRoute>} />
              <Route path="/learn" element={<AuthRoute><Learn /></AuthRoute>} />
              <Route path="/course-content" element={<AuthRoute><CourseContent /></AuthRoute>} />
              <Route path="/course/:title" element={<AuthRoute><CourseDetail /></AuthRoute>} />
              <Route path="/feedback" element={<AuthRoute><Feedback /></AuthRoute>} />
              <Route path="/watch" element={<AuthRoute><CourseContent /></AuthRoute>} />
              <Route path="/playwf/room/:roomCode" element={<AuthRoute><PlayWithFriendRoom /></AuthRoute>} />
              <Route path="/privacy" element={<AuthRoute><PrivacyPolicy /></AuthRoute>} />
              <Route path="/contact" element={<AuthRoute><ContactUs /></AuthRoute>} />
              <Route path="/about" element={<AuthRoute><AboutUs /></AuthRoute>} />

            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </MaxWidthWrapper>
    </ThemeProvider>
  );
}
