import staff_info_dao from "../DAO/staff_info_dao.js";

const StaffInfoDAO = new staff_info_dao();

class staff_service {
  GetStaff(start, limit, callback) {
    const staff = StaffInfoDAO.GetStaff(start, limit, (err, staff) => {
      if (err) {
        return callback(err);
      }
      const mappedStaff = staff.map((member) => {
        if (member.picture) {
          const base64String = member.picture.toString("base64");
          member.pictureBase64 = `data:image/jpeg;base64,${base64String}`;
        }
        return member;
      });

      callback(null, mappedStaff);
    });
  }

  GetStaffCount(callback) {
    const count = StaffInfoDAO.GetStaffCount((err, count) => {
      if (err) {
        return callback(err);
      }
      callback(null, count);
    });
  }

  GetStaffMember(id, callback) {
    StaffInfoDAO.GetStaffMember(id, (err, staff_member) => {
      if (err) {
        callback(err, null);
      }
      if (staff_member.profile_picture) {
        const base64String = staff_member.profile_picture.toString("base64");
        staff_member.profile_picture = `data:image/jpeg;base64,${base64String}`;
      }

      callback(null, staff_member);
    });
  }
}

export default staff_service;
