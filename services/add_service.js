//import { languages_dto } from "../DTO/languages_dto";
import LanguageDAO from "../DAO/languages_dao.js";

const languageDAO = new LanguageDAO();

class add_service {
  GetLanguages(callback) {
    const languages = languageDAO.GetLanguages((err, languages) => {
      if (err) {
        return callback(err);
      }
      callback(null, languages);
    });
  }
}
export default add_service;
