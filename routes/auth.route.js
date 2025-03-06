import express from "express";
import { login, logout, register , verifyEmail , requestPasswordReset , resetPassword, getCurrentUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.get('/me', getCurrentUser);
router.get("/verify-email", verifyEmail);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/login", login);
router.get("/logout", logout);

export default router;