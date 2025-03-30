import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getProfileController, updateProfileController } from "../controllers/profile.controller.js";


const profile_router = Router()

profile_router.get('/', authMiddleware, getProfileController)

profile_router.put('/', authMiddleware, updateProfileController)

export default profile_router