import express from "express";
import language_service from "../services/add_service.js";
import film_service from "../services/film_service.js";
import post_film_dto from "../DTO/post_film_dto.js";
import { logger } from "../src/utils/logger.js";
const router = express.Router();
const languageService = new language_service();
const filmService = new film_service();

/* GET home page. */
router.get("/", function (req, res, next) {
  if (!req.session.logged_in) {
    res.redirect("/login");
  }
  res.redirect("/administration/filter");
});
router.delete("/filter/:id", function (req, res, next) {
  if (!req.session.logged_in) {
    res.redirect("/login");
  }

  console.log("Delete request for ID:", req.params.id);

  if (parseInt(req.params.id, 10)) {
    const id = parseInt(req.params.id, 10);
    console.log("Parsed ID:", id);
  } else {
    return res.redirect(`/filter/`);
  }
  try {
    filmService.DeleteFilm(parseInt(req.params.id, 10), (err, result) => {
      if (err) {
        console.log(err);
        return res.status(404).json({ error: "Film niet gevonden" });
      }
      // ik weet nog niet wat er gebeurd als de film niet bestaat, is dat een 404 of een 204...
      res.status(200).json({ message: "Film succesvol verwijderd" });
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/filter", function (req, res, next) {
  if (!req.session.logged_in) {
    res.redirect("/login");
  }

  let search = req.query.search || "";
  filmService.GetFilms(search, (err, films) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    //console.log(films);
    res.render("filter", {
      title: "Beheer",
      films: films,
    });
  });
});

router.get("/add", function (req, res, next) {
  if (!req.session.logged_in) {
    res.redirect("/login");
  }

  languageService.GetLanguages((err, languages) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    filmService.GetFilmCategories((err, categories) => {
      if (err) {
        return next(err);
      }
      console.log(categories);
      res.render("add", {
        languages: languages,
        categories: categories,
      });
    });
  });
});

router.post("/add", function (req, res, next) {
  console.log("Request body:", req.body);
  logger.info("Request body in administration.js:", req.body);

  if (!req.session.logged_in) {
    res.redirect("/login");
  }
  const { body } = req;

  const post_film = new post_film_dto(
    body.title,
    body.description,
    body.release_year,
    body.length,
    body.language,
    body.rental_rate,
    body.replacement_cost,
    body.rental_duration,
    body.categories,
    body.rating,
    body.actors,
    body.special_features
  );
  try {
    filmService.PostFilms(post_film, (err, result) => {
      if (err) {
        console.error("Error from service callback:", err);
        return next(err);
      }
      res.redirect("/administration/filter");
    });
  } catch (err) {
    console.error("Error calling PostFilms:", err);
    return next(err);
  }
});

export default router;
