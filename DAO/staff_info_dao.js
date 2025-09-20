import { staff_dto } from "../DTO/staff_dto.js";
import staff_member_dto from "../DTO/staff_member_dto.js";

import { logger } from "../src/utils/logger.js";

import pool from "../src/utils/pool.js";

const sql_query_staff_member = `

select 
	CONCAT(s.first_name , ' ', s.last_name ) AS name,
	s.email,
	a.phone,
	co.country as "live_country",
	c.city as "live_city",
	a.address as "live_address",
	co_s.country as "store_country",
	c_s.city  as "store_city",
	a_s.address   as "store_address",
	s.active as "is_active",
	s.picture as "profile_picture"
from staff s
join address a
	on s.address_id = a.address_id 
join city c
	on a.city_id = c.city_id
join country co
	on c.country_id = co.country_id 
join store st
	on s.staff_id = st.manager_staff_id
join address a_s
	on st.address_id = a_s.address_id 
join city c_s
	on a_s.city_id = c_s.city_id 
join country co_s
	on c_s.country_id = co_s.country_id
where s.staff_id = ?

`;

class StaffDAO {
  GetStaff(start, limit, callback) {
    pool.query(
      "SELECT staff_id, first_name, last_name, active, picture FROM staff LIMIT ?, ?",
      [start, limit],
      (err, results, fields) => {
        if (err) {
          console.error(err);
          return callback(err, null);
        }
        const staffList = results.map((row) => {
          return new staff_dto(
            row.staff_id,
            row.first_name,
            row.last_name,
            row.email,
            row.picture,
            row.active === 1
          );
        });
        callback(null, staffList);
      }
    );
  }

  GetStaffCount(callback) {
    pool.query(
      "SELECT COUNT(*) AS count FROM staff",
      (err, results, fields) => {
        if (err) {
          console.error(err);
          return callback(err, null);
        }
        const count = results[0].count;
        callback(null, count);
      }
    );
  }

  GetStaffMember(id, callback) {
    pool.query(sql_query_staff_member, [id], (err, results, fields) => {
      if (err) {
        logger.error(err);
        return callback(err, null);
      }
      console.log("dao,results:", results);

      const staff_member = new staff_member_dto(results[0]);

      console.log("dao: ", staff_member);

      callback(null, staff_member);
    });
  }
} ///

export default StaffDAO;
