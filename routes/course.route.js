import express from "express";
import { createCourse, getAllCourses, getSingleCourse, updateCourse } from "../controllers/course.controller.js";

const router = express.Router();

router.get("/courses", getAllCourses);
router.post("/create", createCourse);
router.put('/update/:id', updateCourse);
router.get("/:id", getSingleCourse);


export default router;