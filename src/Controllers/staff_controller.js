import staff_service from "../services/staff_service.js";
const staffService = new staff_service();
const staffPerPage = 3;

class staff_controller {
  loadStaffMember = (req, res, next) => {
    const staff_id = parseInt(req.params.id, 10) || 1;

    staffService.GetStaffMember(staff_id, (err, staff_member) => {
      if (err) return res.status(500).send("error");

      console.log(staff_member);

      res.render("staff_member", { staff_member });
    });
  };

  loadStaffPage = (req, res, next) => {
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

        RenderPage(MAX_AMOUNT_OF_PAGES, page, res);
      });
    } else {
      const MAX_AMOUNT_OF_PAGES = Math.ceil(
        req.session.staffCount / staffPerPage
      );

      RenderPage(MAX_AMOUNT_OF_PAGES, page, res);
    }
  };

  redirectToStaffRoot = (req, res, next) => {
    res.redirect("/staff/1");
  };
}

function RenderPage(max_amount_pages, currentPage, res) {
  if (currentPage < 1 || currentPage > max_amount_pages) {
    return res.redirect(`/staff/${max_amount_pages}`);
  }

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < max_amount_pages;
  const offset = (currentPage - 1) * staffPerPage;

  staffService.GetStaff(offset, staffPerPage, (err, staff) => {
    if (err) return res.status(500).send("Database error");
    res.render("staff", {
      staff,
      amount_of_pages: max_amount_pages,
      currentPage,
      hasPreviousPage,
      hasNextPage,
    });
  });
}

export default staff_controller;
