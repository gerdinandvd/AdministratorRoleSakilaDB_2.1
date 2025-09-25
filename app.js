import dotenv from "dotenv";
dotenv.config();

import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import session from "express-session";

import indexRouter from "./src/routes/index.js";
//import usersRouter from "./routes/users.js";
import mainRouter from "./src/routes/staff.js";
import administrationRouter from "./src/routes/administration.js";
import loginRouter from "./src/routes/login.js";
import aboutRouter from "./src/routes/about.js";
import e from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true })); // voor form data
app.use(express.json()); // voor JSON data

//secret moet in een .env file komen
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }, // 60 minuut
    rolling: true,
  })
);
//app.use(flash());

app.use("/", indexRouter);
app.use("/staff", mainRouter);
app.use("/administration", administrationRouter);
app.use("/login", loginRouter);
app.use("/about", aboutRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(express.static("public"));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
