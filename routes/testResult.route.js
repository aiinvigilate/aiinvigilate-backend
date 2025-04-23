import express from "express";
import { createTestResult, getReport, getTestHistory, getTestResult } from "../controllers/testResult.controller.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { role } from "../middleware/role.js";

const router = express.Router();


// ONLY LECTURER
router.post("/create",  authenticateUser ,  role.check('lecturer', 'student') ,  createTestResult);

router.post("/students-answers", createTestResult);

router.get("/test-result/:testId", authenticateUser, getTestResult);

router.get("/history", authenticateUser, getTestHistory);

router.get("/report/:testId/:studentId", authenticateUser, getReport);


// router.delete("/delete/:id",  authenticateUser ,  role.check('lecturer') ,  deleteQuestion);

// router.get("/test/:testId",  authenticateUser ,  role.check('student', 'lecturer',) ,  getQuestionsByTest);


export default router;