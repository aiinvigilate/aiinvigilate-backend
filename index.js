import './config/cloudinary.js'
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import courseRoute from "./routes/course.route.js";
import passportConfig from './config/passport.js';
import { seedDB } from './lib/seed.js';


dotenv.config();
const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

passportConfig(app);

seedDB();
app.use("/api/auth", authRoute);
app.use("/api/course", courseRoute);


app.listen(8800, () => {
  console.log("Server is running!");
});