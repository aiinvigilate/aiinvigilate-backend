import express from "express";
import { createTest, getTestsByModule, getTestsByUser, getTestsByUserAndModule, updateTest } from "../controllers/test.controller.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { role } from "../middleware/role.js";

const router = express.Router();

// Create a new test - Lecturer
router.post("/create", authenticateUser, role.check("lecturer"), createTest);

router.post("/update/:id", authenticateUser, role.check("lecturer"), updateTest);

// Get tests for the logged-in user
router.get("/user/tests", authenticateUser, getTestsByUser);
router.get("/user/tests/:moduleId", authenticateUser, getTestsByUserAndModule);



export default router;




