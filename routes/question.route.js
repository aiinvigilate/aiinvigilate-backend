import express from "express";
import { createQuestion, deleteQuestion, getQuestionsByTest } from "../controllers/question.controller.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { role } from "../middleware/role.js";

const router = express.Router();


// ONLY LECTURER
router.post("/create",  authenticateUser ,  role.check('lecturer') ,  createQuestion);
router.delete("/delete/:id",  authenticateUser ,  role.check('lecturer') ,  deleteQuestion);

router.get("/test/:testId",  authenticateUser ,  role.check('student', 'lecturer',) ,  getQuestionsByTest);

// router.put('/update/:id',  authenticateUser ,  role.check('admin') , updateModule);
// router.get('/modules', authenticateUser ,  role.check('admin') , getAllModules);



// router.get("/:id", authenticateUser , role.check('student', 'lecturer', 'admin') ,  getSingleModule);

// STUDENT AND LECTURER
// router.get("/user", authenticateUser , role.check('student', 'lecturer') ,  getUserModules);




export default router;