import express from "express";
import multer from "multer";
import { uploadFirstImageWhenTestStart , comapreImageWithFirstImage  } from "../controllers/image.controller.js";

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload-first', upload.single('image') , uploadFirstImageWhenTestStart );
router.post('/compare-second', upload.single('image') , comapreImageWithFirstImage );

export default router;