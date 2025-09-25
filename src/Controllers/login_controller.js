import LoginService from "../services/login_service.js"; // let op hoofdletter
const loginService = new LoginService();

class login_controller {
  tryLogin = (req, res, next) => {
    const { username, password } = req.body;

    loginService.AreCredentialsValid(
      username,
      password,
      (err, credentials_are_valid) => {
        if (err) {
          console.log(err);
          res.render("login", {
            error: "Er is een fout opgetreden, probeer later opnieuw.",
          });
        }
        if (credentials_are_valid) {
          req.session.logged_in = true;
          res.redirect("/staff/1");
        } else {
          console.log(credentials_are_valid);
          res.render("login", {
            error: "Inloggegevens zijn onjuist, probeer opnieuw.",
          });
        }
      }
    );
  };

  logout = (req, res, next) => {
    req.session.logged_in = false;
    res.redirect("/login");
  };

  loadLoginPage = (req, res, next) => {
    res.render("login", { error: null });
  };
}

export default login_controller;
