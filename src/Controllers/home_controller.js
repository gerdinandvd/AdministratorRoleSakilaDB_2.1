class home_controller {
  loadIndex = (req, res, next) => {
    res.render("index", { title: "My app" });
  };

  loadAbout = (req, res, next) => {
    req.session.logged_in = false;
    res.render("about");
  };
}

export default home_controller;
