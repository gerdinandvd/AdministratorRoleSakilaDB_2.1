import express from "express";
import LoginController from "../Controllers/login_controller.js";

const router = express.Router();
const loginController = new LoginController();

router.get("/", loginController.loadLoginPage);
router.post("/", loginController.tryLogin);
router.get("/logout", loginController.logout);

export default router;
