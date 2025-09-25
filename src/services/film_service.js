import films_dao from "../DAO/films_dao.js";
import PostFilmDao from "../DAO/post_film_dao.js";
import post_film_dto from "../DTO/post_film_dto.js";
import { logger } from "../utils/logger.js";

const filmsDAO = new films_dao();
const postFilmDao = new PostFilmDao();

class film_service {
  GetFilms(query, callback) {
    filmsDAO.GetFilms(query, (err, films) => {
      if (err) {
        return callback(err);
      }
      callback(null, films);
    });
  }

  GetFilmCategories(callback) {
    filmsDAO.GetFilmCategories((err, categories) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, categories);
    });
  }

  DeleteFilm(id, callback) {
    try {
      filmsDAO.DeleteFilm(id, (err, result) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      });
    } catch (error) {
      console.log(error);
    }
  }

  PostFilms(post_film_dto, callback) {
    logger.info("post_film_dto in film_service.js:", post_film_dto);
    postFilmDao.PostFilms(post_film_dto, (err, result) => {
      logger.info(
        "post_film_dto in film_service.js in callback:",
        post_film_dto
      );

      logger.info("Result in film_service.js:", result);
      logger.info("Error in film_service.js:", err);
      if (err) {
        console.log("film_service: ", err);
        logger.error(err.message);
        return callback(err, null);
      }
      logger.info("Film successfully added");
      logger.info("film_service: ", result);
      callback(null, result);
    });
  }
}

export default film_service;
