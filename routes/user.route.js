import express from "express";
import { getAllUsers, getUserById, toggleUserBlock, updateUser } from "../controllers/user.controller.js";
import { role } from "../middleware/role.js";
import auth from "../middleware/auth.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", authenticateUser , role.check('admin') , getAllUsers);
router.get("/:userId", authenticateUser , getUserById);
// router.put("/update/:id", updateUser);
router.put("/update", authenticateUser , updateUser);

router.post("/toggle-block", authenticateUser , role.check('admin'),   toggleUserBlock)


export default router;