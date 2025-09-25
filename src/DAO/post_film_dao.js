import pool from "../utils/pool.js";
import { logger } from "../utils/logger.js";

class PostFilmDao {
  PostFilms(post_film_dto, callback) {
    console.log("DAO PostFilms called with:", post_film_dto);
    logger.info("post_film_dto in post_film_dao.js:", post_film_dto);

    let queryObj;
    try {
      queryObj = MakeFullQuery(post_film_dto);
    } catch (err) {
      console.error("Error in MakeFullQuery:", err);
      return callback(err, null);
    }

    const { sql, values } = queryObj;

    console.log("Final SQL values:", values);

    pool.query(sql, values, (err, results, fields) => {
      if (err) {
        logger.error(err);
        console.error("post_film_dao: ", err);
        return callback(err, null);
      }
      logger.info("Film successfully added");
      console.log("post_film_dao: ", results);
      console.log("post_film_dao - sql: ", sql);
      console.log("post_film_dao - values: ", values);

      callback(null, results);
    });
  }
}

function MakeFullQuery(post_film_dto) {
  console.log("MakeFullQuery - post_film_dto:", post_film_dto);
  const {
    title,
    description,
    release_year,
    rental_duration,
    rental_rate,
    length,
    replacement_cost,
    rating,
    categories,
    actors,
    special_features,
  } = post_film_dto;

  const values = [];
  const special_features_right = special_features.join(",");

  const language_right = parseInt(post_film_dto.language, 10) || 1;

  const insert_query = `
    INSERT INTO film
      (title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    SET @film_id = LAST_INSERT_ID();
  `;
  values.push(
    title,
    description,
    release_year,
    language_right,
    rental_duration,
    rental_rate,
    length,
    replacement_cost,
    rating,
    special_features_right
  );

  const { sql: catSql, values: catValues } = CreateFilmCreateQuery(categories);
  values.push(...catValues);

  const { sql: actorSql, values: actorValues } = MakeInsertActorQuery(actors);
  values.push(...actorValues);

  const { sql: faSql, values: faValues } = MakeInsertFilmActorQuery(actors);
  values.push(...faValues);

  const full_query = insert_query + catSql + actorSql + faSql;
  return { sql: full_query, values };
}

function CreateFilmCreateQuery(categories) {
  console.log("CreateFilmCreateQuery - categories:", categories);
  if (!categories || categories.length === 0) return { sql: "", values: [] };

  let sql = `INSERT INTO film_category (film_id, category_id) VALUES `;
  const values = [];
  sql += categories.map(() => "(@film_id, ?)").join(",") + ";";
  values.push(...categories);
  return { sql, values };
}

function MakeInsertActorQuery(actors) {
  console.log("MakeInsertActorQuery - actors:", actors);
  if (!actors || actors.length === 0) return { sql: "", values: [] };

  let sql = `INSERT INTO actor (first_name, last_name)
             SELECT tmp.first_name, tmp.last_name
             FROM (`;

  const values = [];

  sql += `SELECT ? AS first_name, ? AS last_name`;
  values.push(actors[0].first_name, actors[0].last_name);

  for (let i = 1; i < actors.length; i++) {
    sql += ` UNION ALL SELECT ?, ?`;
    values.push(actors[i].first_name, actors[i].last_name);
  }

  sql += `) AS tmp
          WHERE NOT EXISTS (
            SELECT 1 FROM actor a
            WHERE a.first_name = tmp.first_name AND a.last_name = tmp.last_name
          );`;

  return { sql, values };
}

function MakeInsertFilmActorQuery(actors) {
  console.log("MakeInsertFilmActorQuery - actors:", actors);
  if (!actors || actors.length === 0) return { sql: "", values: [] };

  let sql = `INSERT INTO film_actor (actor_id, film_id) VALUES `;
  const values = [];

  sql +=
    actors
      .map(
        () =>
          `((SELECT actor_id FROM actor WHERE first_name = ? AND last_name = ?), @film_id)`
      )
      .join(",") + ";";

  actors.forEach((actor) => {
    values.push(actor.first_name, actor.last_name);
  });

  return { sql, values };
}

export default PostFilmDao;
