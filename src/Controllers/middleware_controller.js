class middleware_controller {
  RedirectIfNotLoggedIn = (req, res, next) => {
    if (!req.session.logged_in) {
      return res.redirect("/login");
    }
    next();
  };
}

export default middleware_controller;
