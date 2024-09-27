const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
