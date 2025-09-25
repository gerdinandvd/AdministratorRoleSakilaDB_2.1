import express from "express";
import home_controller from "../Controllers/home_controller.js";
const HomeController = new home_controller();
const router = express.Router();

/* GET home page. */
router.get("/", HomeController.loadIndex);

export default router;
