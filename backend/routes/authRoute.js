import express from "express"
import { LogOut, SignIn, SignUp, WhoAmI } from "../controllers/authController.js";
import { protectedRoute } from "../middlewares/authorization.js";
const router = express.Router();




router.post("/signUp", SignUp)
router.post("/login", SignIn)
router.post("/logout", LogOut)
router.get("/WhoAmI", protectedRoute , WhoAmI)




export default router;