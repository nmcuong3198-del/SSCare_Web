const USER_KEY = "user";
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const LOGIN_AT_KEY = "loginAt";

const AUTH_KEYS = [USER_KEY, TOKEN_KEY, REFRESH_TOKEN_KEY, LOGIN_AT_KEY];

const hasSessionCredential = (storage) =>
  Boolean(storage.getItem(TOKEN_KEY) || storage.getItem(REFRESH_TOKEN_KEY));

const resolveStorage = () => {
  // localStorage = người dùng đã chọn "Ghi nhớ đăng nhập".
  // sessionStorage = chỉ duy trì trong phiên trình duyệt hiện tại.
  // Ưu tiên nơi đang có token thực tế; fallback localStorage giúp tương thích
  // với các phiên đăng nhập cũ trước khi bổ sung tính năng remember-me.
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

const clearStorage = (storage) => {
  AUTH_KEYS.forEach((key) => storage.removeItem(key));
};

const authStorage = {
  keys: {
    user: USER_KEY,
    token: TOKEN_KEY,
    refreshToken: REFRESH_TOKEN_KEY,
    loginAt: LOGIN_AT_KEY,
  },

  getItem(key) {
    return resolveStorage().getItem(key);
  },

  setItem(key, value) {
    resolveStorage().setItem(key, value);
  },

  clear() {
    clearStorage(localStorage);
    clearStorage(sessionStorage);
  },

  saveLoginSession({ user, accessToken, refreshToken, remember }) {
    // Không để tồn tại đồng thời session cũ ở cả hai storage.
    this.clear();

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
