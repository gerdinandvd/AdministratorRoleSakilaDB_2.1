//import { use } from "react";
import bcrypt from "bcrypt";
import pool from "../src/utils/pool.js";

class LoginDAO {
  AreCredentialsValid(username, password, callback) {
    const query = `
      SELECT Password
      FROM administrators
      WHERE Username = ?
    `;
    pool.query(query, [username], (err, result) => {
      if (err) return callback(err, null);
      if (result.length === 0) return callback(null, false);

      bcrypt.compare(password, result[0].Password, (err, match) => {
        if (err) return callback(err, null);
        callback(null, match);
      });
    });
  }
}

export default LoginDAO;
