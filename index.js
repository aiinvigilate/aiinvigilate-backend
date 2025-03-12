import './config/cloudinary.js'
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import courseRoute from "./routes/course.route.js";
import moduleRoute from "./routes/module.route.js";
import takeExamRoute from "./routes/testResult.route.js";
import questionRoute from "./routes/question.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import passportConfig from './config/passport.js';
import { seedDB } from './lib/seed.js';


dotenv.config();
const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

passportConfig(app);

seedDB();

app.get("/", (req, res) => {
  res.send("Welcome to the E-Learning API");
});


app.use("/api/auth", authRoute);
app.use("/api/course", courseRoute);
app.use("/api/module", moduleRoute);
app.use("/api/test", testRoute);
app.use("/api/take/exam", takeExamRoute);
app.use("/api/question", questionRoute);
app.use("/api/user", userRoute);


app.listen(8800, () => {
  console.log("Server is running!");
});