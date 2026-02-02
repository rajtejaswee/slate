import { Router } from "express";
import { signup, signin } from "../controllers/auth.controller";
import { googleAuth,googleCallback } from "../controllers/google.controller";
import { githubAuth, githubCallback } from "../controllers/github.controller";

const router = Router();

// Standard Auth
router.route("/signup").post(signup);
router.route("/signin").post(signin);

// Google OAuth
router.route("/google").get(googleAuth);
router.route("/google/callback").get(googleCallback);

// GitHub OAuth
router.route("/github").get(githubAuth);
router.route("/github/callback").get(githubCallback);

export default router;