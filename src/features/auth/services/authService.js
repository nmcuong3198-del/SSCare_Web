import axiosClient from "@/shared/services/http/axiosClient";

const USER_KEY = "user";
const TOKEN_KEY = "token";
const LOGIN_AT_KEY = "loginAt";

const getTokenFromUser = (user) =>
  user?.accessToken || user?.token || user?.jwt || user?.data?.accessToken || null;

const authService = {
  login(user) {
    return axiosClient.post("/user/login", user);
  },

  logout() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LOGIN_AT_KEY);
  },

  getCurrentUser() {
    const rawUser = localStorage.getItem(USER_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser);
    } catch {
      this.logout();
      return null;
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  saveUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(LOGIN_AT_KEY, Date.now().toString());

    const token = getTokenFromUser(user);

    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  isAuthenticated() {
    // return Boolean(this.getCurrentUser() && this.getToken());
    return Boolean(this.getCurrentUser());
  },
};

export default authService;
