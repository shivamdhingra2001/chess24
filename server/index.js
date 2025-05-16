require("dotenv").config();
require("./utils/dbConnect")();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const PORT =  process.env.PORT || 8000;
const userRoutes = require("./routes/UserRoutes");
const gameRoutes = require("./routes/GameRoutes");
const paymentRoutes = require("./routes/PaymentRoutes");
const coursesRoute = require('./routes/Courses.js');
const authRoutes = require("./routes/AuthRoutes");
const { errorHandler } = require("./middleware/errorHandler");
const cors = require("cors");
const alluserDelete = require("./utils/devUtils/alluserDelete");
const http = require("http");
const { Server } = require("socket.io");
const ws = require("./websocket/ws");
const allGamesDelete = require("./utils/devUtils/allGamesDelete");
const webhookRoute = require("./routes/WebHook.js");
const server = http.createServer(app);
const session = require('express-session');
const passport = require('passport');
require('./utils/passport');
const OAuthRoutes = require('./routes/OAuthRoutes');

const corsOptions = {
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
};
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoute);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

//Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => ws(io, socket));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/games", gameRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/courses', coursesRoute);
app.use("/api/v1/users", OAuthRoutes);
app.use("/api/auth", authRoutes);
//for dev purposes only
app.get("/deleteAllUsers", (req, res) => {
  alluserDelete();
  res.send("All users deleted");
});
app.get("/deleteAllGames", (req, res) => {
  allGamesDelete();
  res.send("All games deleted");
});

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
