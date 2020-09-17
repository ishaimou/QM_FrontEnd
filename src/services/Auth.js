const jwt = require("jsonwebtoken");
class AuthService {
  isValid(token) {
    const decoded = jwt.decode(token);
    if (decoded) {
      if (Date.now() >= decoded.exp * 1000) return false;
      else return true;
    }
  }
  isAuthenticated() {
    return this.isValid(this.getToken());
  }
  getToken() {
    const token = localStorage.getItem("token");
    return token;
  }
}

export default new AuthService();
