import express from "express";
import { createModule, getAllModules, getSingleModule, getUserModules, updateModule } from "../controllers/module.controller.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { role } from "../middleware/role.js";

const router = express.Router();


router.get('/modules', authenticateUser ,  role.check('admin') , getAllModules);

router.get("/:id", authenticateUser , role.check('student', 'lecturer', 'admin') ,  getSingleModule);

// STUDENT AND LECTURER
router.get("/user", authenticateUser , role.check('student', 'lecturer') ,  getUserModules);

// ONLY ADMIN
router.post("/create",  authenticateUser ,  role.check('admin') ,  createModule);
router.put('/update/:id',  authenticateUser ,  role.check('admin') , updateModule);




export default router;