import film_service from "../services/film_service.js";
import language_service from "../services/add_service.js";
import post_film_dto from "../DTO/post_film_dto.js";
const filmService = new film_service();
const languageService = new language_service();

class admin_controller {
  redirectToFilter = (req, res, next) => {
    res.redirect("/administration/filter");
  };

  deleteFilm = (req, res, next) => {
    if (!req.session.logged_in) {
      return res.redirect("/login");
    }
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
        res.status(200).json({ message: "Film succesvol verwijderd" });
      });
    } catch (err) {
      console.error(err);
    }
  };

  filterFilms = (req, res, next) => {
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
  };

  AddFilmInfo = (req, res, next) => {
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
  };

  PostNewFilm = (req, res, next) => {
    const { body } = req;

    console.log(body);

    const categories = Array.isArray(body["categories[]"])
      ? body["categories[]"]
      : [body["categories[]"]];

    const special_features = Array.isArray(body["special_features[]"])
      ? body["special_features[]"]
      : [body["special_features[]"]];

    const actors = [];
    const firstNamesRaw = body["actors_first_name[]"];
    const lastNamesRaw = body["actors_last_name[]"];

    const firstNames = firstNamesRaw
      ? Array.isArray(firstNamesRaw)
        ? firstNamesRaw
        : [firstNamesRaw]
      : [];

    const lastNames = lastNamesRaw
      ? Array.isArray(lastNamesRaw)
        ? lastNamesRaw
        : [lastNamesRaw]
      : [];

    for (let i = 0; i < firstNames.length; i++) {
      if (firstNames[i] && lastNames[i]) {
        console.log(`Adding actor: ${firstNames[i]} ${lastNames[i]}`);
        actors.push({ first_name: firstNames[i], last_name: lastNames[i] });
      }
    }

    const release_year = GrabYearFromMonthInput(body.release_year);

    const length = GrabMinutesTimeInput(body.length);

    const post_film = new post_film_dto(
      body.title,
      body.description,
      release_year,
      length,
      body.language,
      body.rental_rate,
      body.replacement_cost,
      body.rental_duration,
      categories,
      body.rating,
      actors,
      special_features
    );

    console.log("Controller - New film to add:", post_film);

    filmService.PostFilms(post_film, (err, result) => {
      if (err) {
        console.error("Error from service callback:", err);
        return next(err);
      }
      res.redirect("/administration/filter");
    });
  };
}

function GrabYearFromMonthInput(input) {
  if (input) {
    return parseInt(input.split("-")[0], 10);
  }
  return null;
}

function GrabMinutesTimeInput(input) {
  if (input) {
    const [hours, minutes] = input.split(":").map(Number);
    return hours * 60 + minutes;
  }
  return null;
}

export default admin_controller;
