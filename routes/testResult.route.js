import express from "express";
import { createTestResult } from "../controllers/testResult.controller.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { role } from "../middleware/role.js";

const router = express.Router();


// ONLY LECTURER
router.post("/create",  authenticateUser ,  role.check('lecturer', 'student') ,  createTestResult);



// router.delete("/delete/:id",  authenticateUser ,  role.check('lecturer') ,  deleteQuestion);

// router.get("/test/:testId",  authenticateUser ,  role.check('student', 'lecturer',) ,  getQuestionsByTest);



export default router;