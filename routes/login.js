import express from "express";
import login_service from "../services/login_service.js";

const loginService = new login_service();

import session from "express-session";
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("login");
});

router.post("/", (req, res, next) => {
  const { username, password } = req.body;

  loginService.AreCredentialsValid(
    username,
    password,
    (err, credentials_are_valid) => {
      if (err) {
        // afhandelen met rode tekst enzo.
        console.log(err);
      }
      if (credentials_are_valid) {
        req.session.logged_in = true;
        res.redirect("/staff/1");
      } else {
        console.log(credentials_are_valid);
      }
    }
  );
});

router.get("/logout", (req, res, next) => {
  req.session.logged_in = false;
  res.redirect("/login");
});

export default router;
