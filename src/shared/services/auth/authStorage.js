const USER_KEY = "user";
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const LOGIN_AT_KEY = "loginAt";

// Đây là preference của màn hình đăng nhập, KHÔNG phải credential/session.
// Giữ lại qua logout để lần sau mở /login vẫn hiện username + checkbox.
const REMEMBER_LOGIN_KEY = "rememberLogin";
const REMEMBERED_USERNAME_KEY = "rememberedUsername";

const AUTH_KEYS = [USER_KEY, TOKEN_KEY, REFRESH_TOKEN_KEY, LOGIN_AT_KEY];

const hasSessionCredential = (storage) =>
  Boolean(storage.getItem(TOKEN_KEY) || storage.getItem(REFRESH_TOKEN_KEY));

const resolveStorage = () => {
  // localStorage = người dùng đã chọn "Ghi nhớ đăng nhập".
  // sessionStorage = chỉ duy trì trong phiên trình duyệt hiện tại.
  if (hasSessionCredential(localStorage)) {
    return localStorage;
  }

  if (hasSessionCredential(sessionStorage)) {
    return sessionStorage;
  }

  if (localStorage.getItem(USER_KEY)) {
    return localStorage;
  }

  if (sessionStorage.getItem(USER_KEY)) {
    return sessionStorage;
  }

  return sessionStorage;
};

const clearAuthStorage = (storage) => {
  AUTH_KEYS.forEach((key) => storage.removeItem(key));
};

const clearRememberedLogin = () => {
  localStorage.removeItem(REMEMBER_LOGIN_KEY);
  localStorage.removeItem(REMEMBERED_USERNAME_KEY);
};

const authStorage = {
  keys: {
    user: USER_KEY,
    token: TOKEN_KEY,
    refreshToken: REFRESH_TOKEN_KEY,
    loginAt: LOGIN_AT_KEY,
    rememberLogin: REMEMBER_LOGIN_KEY,
    rememberedUsername: REMEMBERED_USERNAME_KEY,
  },

  getItem(key) {
    return resolveStorage().getItem(key);
  },

  setItem(key, value) {
    resolveStorage().setItem(key, value);
  },

  // Chỉ xóa phiên xác thực. Không xóa preference "Ghi nhớ đăng nhập".
  clear() {
    clearAuthStorage(localStorage);
    clearAuthStorage(sessionStorage);
  },

  getRememberedLogin() {
    const remember = localStorage.getItem(REMEMBER_LOGIN_KEY) === "true";
    const username = remember
      ? localStorage.getItem(REMEMBERED_USERNAME_KEY) || ""
      : "";

    return { remember, username };
  },

  saveRememberedLogin({ remember, username }) {
    if (!remember) {
      clearRememberedLogin();
      return;
    }

    localStorage.setItem(REMEMBER_LOGIN_KEY, "true");
    localStorage.setItem(REMEMBERED_USERNAME_KEY, username?.trim() || "");
  },

  saveLoginSession({ user, accessToken, refreshToken, remember, username }) {
    // Xóa session cũ ở cả hai nơi nhưng vẫn giữ preference login.
    this.clear();
    this.saveRememberedLogin({ remember, username });

    const targetStorage = remember ? localStorage : sessionStorage;
    targetStorage.setItem(USER_KEY, JSON.stringify(user));
    targetStorage.setItem(LOGIN_AT_KEY, Date.now().toString());

    if (accessToken) {
      targetStorage.setItem(TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      targetStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  updateSession({ user, accessToken, refreshToken }) {
    const targetStorage = resolveStorage();

    if (user) {
      targetStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    if (accessToken) {
      targetStorage.setItem(TOKEN_KEY, accessToken);
    }
    if (refreshToken) {
      targetStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },
};

export default authStorage;
