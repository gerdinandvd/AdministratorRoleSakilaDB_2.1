import pool from "../src/utils/pool.js";

import get_film_dto from "../DTO/get_film_dto.js";
import get_film_categories_dto from "../DTO/get_film_category_dto.js";

const sql_query = `
  SELECT film.film_id, film.title, category.name, film.release_year, film.length, film.rating
  FROM film
  INNER JOIN film_category
    ON film.film_id = film_category.film_id
  INNER JOIN category
    ON film_category.category_id = category.category_id
  WHERE film.title LIKE ?
`;

const delete_film_query = `
DELETE FROM film_actor WHERE film_id = ?;
DELETE FROM film_category WHERE film_id = ?;
DELETE FROM film where film_id = ?;
`;

const get_film_categories_query = `
SELECT category_id as 'id', name
FROM category;
`;

class films_dao {
  GetFilms(query, callback) {
    pool.query(sql_query, [`%${query}%`], (err, results, fields) => {
      if (err) {
        console.error(err);
        return callback(err, null);
      }

      const films = results.map(
        (row) =>
          new get_film_dto(
            row.film_id,
            row.title,
            row.name,
            row.release_year,
            row.length,
            row.rating
          )
      );
      console.log(films);
      callback(null, films);
    });
  }

  GetFilmCategories(callback) {
    pool.query(get_film_categories_query, (err, result, fields) => {
      if (err) {
        return callback(err, null);
      }
      const categories = result.map(
        (row) => new get_film_categories_dto(row.id, row.name)
      );
      callback(null, categories);
    });
  }

  DeleteFilm(id, callback) {
    try {
      pool.query(delete_film_query, [id, id, id], (err, result, fields) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, result);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
export default films_dao;
