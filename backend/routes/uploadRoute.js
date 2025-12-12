import express from "express";
import upload from "../middleware/upload.js";
import { requireAuth } from "../middleware/authRequire.js";
import { deleteUploadController, uploadController } from "../controllers/uploadController.js";

export const uploadRoute = express.Router()

uploadRoute.post('/upload-avatar',requireAuth,upload.single('avatar'),uploadController)

uploadRoute.delete('/upload-delete',requireAuth,deleteUploadController)