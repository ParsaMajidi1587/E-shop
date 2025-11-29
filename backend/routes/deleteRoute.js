import express from "express";
import { authDelete } from "../controllers/authController.js";


export const deleteRoute = express.Router()

deleteRoute.delete('/delete-account',authDelete)