import express from "express";
import home_controller from "../Controllers/home_controller.js";
import login_controller from "../Controllers/login_controller.js";
const HomeController = new home_controller();
const LoginController = new login_controller();
const router = express.Router();

/* GET users listing. */
router.get("/", HomeController.loadAbout);

export default router;
