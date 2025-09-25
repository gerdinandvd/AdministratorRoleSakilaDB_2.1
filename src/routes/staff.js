import express from "express";
import staff_controller from "../Controllers/staff_controller.js";
import middleware_controller from "../Controllers/middleware_controller.js";
import staff_member_dto from "../DTO/staff_member_dto.js";
import { render } from "ejs";
const router = express.Router();

const staffController = new staff_controller();
const middlewareController = new middleware_controller();

router.get(
  "/member/:id",
  middlewareController.RedirectIfNotLoggedIn,
  staffController.loadStaffMember
);

router.get(
  "/:page",
  middlewareController.RedirectIfNotLoggedIn,
  staffController.loadStaffPage
);

router.get(
  "/",
  middlewareController.RedirectIfNotLoggedIn,
  staffController.redirectToStaffRoot
);

export default router;
