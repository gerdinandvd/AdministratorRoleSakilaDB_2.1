import express from "express";
import administration_controller from "../Controllers/admin_controller.js";
import middleware_controller from "../Controllers/middleware_controller.js";
import language_service from "../services/add_service.js";
import film_service from "../services/film_service.js";
import post_film_dto from "../DTO/post_film_dto.js";
import { logger } from "../utils/logger.js";
const router = express.Router();
const languageService = new language_service();
const filmService = new film_service();
const adminController = new administration_controller();
const middlewareController = new middleware_controller();

router.get(
  "/",
  middlewareController.RedirectIfNotLoggedIn,
  adminController.redirectToFilter
);

router.delete(
  "/filter/:id",
  middlewareController.RedirectIfNotLoggedIn,
  adminController.deleteFilm
);

router.get(
  "/filter",
  middlewareController.RedirectIfNotLoggedIn,
  adminController.filterFilms
);

router.get(
  "/add",
  middlewareController.RedirectIfNotLoggedIn,
  adminController.AddFilmInfo
);

router.post(
  "/add",
  middlewareController.RedirectIfNotLoggedIn,
  adminController.PostNewFilm
);

export default router;
