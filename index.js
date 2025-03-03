import './config/cloudinary.js'
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import caseRoute from "./routes/case.route.js";
import passportConfig from './config/passport.js';


dotenv.config();
const app = express();

// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

passportConfig(app);

app.use("/api/auth", authRoute);
app.use("/api/case", caseRoute);


app.listen(8800, () => {
  console.log("Server is running!");
});