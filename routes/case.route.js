import express from "express";
import  auth  from "../middleware/auth.js";
import {role} from "../middleware/role.js";
import { createCase } from "../controllers/case.controller.js";
import { $Enums } from '@prisma/client';
const router = express.Router();

router.post("/open",  auth , role.check($Enums.Role.PUBLIC_USER)  , createCase);


export default router;