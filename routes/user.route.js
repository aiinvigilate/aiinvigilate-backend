import express from "express";
import { getAllUsers, updateUser } from "../controllers/user.controller.js";
import { role } from "../middleware/role.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/users", getAllUsers);
// router.put("/update/:id", updateUser);
// router.put("/update/:id", updateUser);
router.put("/update/:id", updateUser);


export default router;