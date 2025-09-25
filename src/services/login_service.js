import login_dao from "../DAO/login_dao.js";

const loginDAO = new login_dao();

class LoginService {
  AreCredentialsValid(username, password, callback) {
    loginDAO.AreCredentialsValid(username, password, (err, result) => {
      if (err) return callback(err, null);

      const is_valid = !!result;
      callback(null, is_valid);
    });
  }
}

export default LoginService;
