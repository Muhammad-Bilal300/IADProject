import express from "express";
import {
  googleSignIn,
  signOut,
  signin,
  signup,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/googleSignIn", googleSignIn);
router.get("/signout", signOut);

export default router;
