import express from "express";
import staff_service from "../services/staff_service.js";
import staff_member_dto from "../DTO/staff_member_dto.js";
const router = express.Router();
let MAX_AMOUNT_OF_PAGES = 5;
const staffPerPage = 3;

const staffService = new staff_service();

router.get("/member/:id", (req, res, next) => {
  if (!req.session.logged_in) {
    res.redirect("/login");
  }

  const staff_id = parseInt(req.params.id, 10) || 1;

  staffService.GetStaffMember(staff_id, (err, staff_member) => {
    if (err) return res.status(500).send("error");

    console.log(staff_member);

    res.render("staff_member", { staff_member });
  });
});

router.get("/:page", (req, res, next) => {
  if (!req.session.logged_in) {
    res.redirect("/login");
  }
  let page = 0;
  if (parseInt(req.params.page, 10)) {
    page = parseInt(req.params.page, 10);
  } else {
    return res.redirect(`/staff/`);
  }

  if (req.session.staffCount === undefined) {
    staffService.GetStaffCount((err, count) => {
      if (err) return res.status(500).send("Database error");

      req.session.staffCount = count;
      const MAX_AMOUNT_OF_PAGES = Math.ceil(count / staffPerPage);

      if (page < 1 || page > MAX_AMOUNT_OF_PAGES) {
        return res.redirect(`/staff/${MAX_AMOUNT_OF_PAGES}`);
      }

      const offset = (page - 1) * staffPerPage;
      const hasPreviousPage = page > 1;
      const hasNextPage = page < MAX_AMOUNT_OF_PAGES;

      staffService.GetStaff(offset, staffPerPage, (err, staff) => {
        if (err) return res.status(500).send("Database error");

        res.render("staff", {
          staff,
          amount_of_pages: MAX_AMOUNT_OF_PAGES,
          currentPage: page,
          hasPreviousPage,
          hasNextPage,
        });
      });
    });
  } else {
    const MAX_AMOUNT_OF_PAGES = Math.ceil(
      req.session.staffCount / staffPerPage
    );

    if (page < 1 || page > MAX_AMOUNT_OF_PAGES) {
      return res.redirect(`/staff/${MAX_AMOUNT_OF_PAGES}`);
    }

    const offset = (page - 1) * staffPerPage;
    const hasPreviousPage = page > 1;
    const hasNextPage = page < MAX_AMOUNT_OF_PAGES;

    staffService.GetStaff(offset, staffPerPage, (err, staff) => {
      if (err) return res.status(500).send("Database error");

      res.render("staff", {
        staff,
        amount_of_pages: MAX_AMOUNT_OF_PAGES,
        currentPage: page,
        hasPreviousPage,
        hasNextPage,
      });
    });
  }
});

router.get("/", (req, res, next) => {
  if (!req.session.logged_in) {
    res.redirect("/login");
  }
  res.redirect("/staff/1");
});

export default router;
