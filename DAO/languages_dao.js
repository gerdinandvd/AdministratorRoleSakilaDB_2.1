import language_dto from "../DTO/language_dto.js";

import { logger } from "../src/utils/logger.js";

import pool from "../src/utils/pool.js";

class LanguageDAO {
  GetLanguages(callback) {
    pool.query(
      "SELECT language_id, name FROM language",
      (err, results, fields) => {
        if (err) {
          console.error(err);
          return callback(err, null);
        }
        callback(
          null,
          results.map((row) => new language_dto(row.name, row.language_id))
        );
      }
    );
  }
}

export default LanguageDAO;
