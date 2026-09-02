import axiosClient from "@/shared/services/http/axiosClient";

const USER_KEY = "user";
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const LOGIN_AT_KEY = "loginAt";

const CMS_ROLES = ["ADMIN", "CONTENT_EDITOR", "NOTIFICATION_MANAGER"];

const normalizeSessionUser = (authResponse) => {
  const account = authResponse?.account || {};

  return {
    ...account,
    fullName: account.fullName || account.displayName,
    username: account.email || account.phone,
    accessToken: authResponse?.accessToken,
    accessTokenExpiresAt: authResponse?.accessTokenExpiresAt,
    refreshTokenExpiresAt: authResponse?.refreshTokenExpiresAt,
  };
};

const authService = {
  register(form) {
    return axiosClient.post("/v1/auth/register", {
      displayName: form.displayName?.trim(),
      fullName: form.fullName?.trim(),
      parentRelationCode: form.parentRelationCode,
      dateOfBirth: form.dateOfBirth,
      email: form.email?.trim(),
      phone: form.phone?.trim(),
      password: form.password,
    });
  },

  resendRegistrationOtp(challengeId) {
    return axiosClient.post("/v1/auth/resend-otp", { challengeId });
  },

  async verifyRegistration({ challengeId, otp }) {
    const authResponse = await axiosClient.post("/v1/auth/verify-registration", {
      challengeId,
      otp,
      deviceLabel: "SSCare Web Registration",
    });

    // Giống luồng App: xác thực OTP chỉ tạo tài khoản, không tự đăng nhập.
    // Backend hiện trả về một refresh session mới nên thu hồi ngay session này.
    if (authResponse?.refreshToken) {
      try {
        await axiosClient.post("/v1/auth/logout", {
          refreshToken: authResponse.refreshToken,
        });
      } catch {
        // Best effort: web không lưu access/refresh token của phiên đăng ký.
      }
    }

    return authResponse;
  },

  login(form) {
    return axiosClient.post("/v1/auth/login", {
      identity: form.username?.trim(),
      password: form.password,
      deviceLabel: "SSCare Web CMS",
    });
  },

  logout() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(LOGIN_AT_KEY);
  },

  getCurrentUser() {
    const rawUser = localStorage.getItem(USER_KEY);

    if (!rawUser) return null;

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

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  saveUser(authResponse) {
    const user = normalizeSessionUser(authResponse);

    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(LOGIN_AT_KEY, Date.now().toString());

    if (authResponse?.accessToken) {
      localStorage.setItem(TOKEN_KEY, authResponse.accessToken);
    }
    if (authResponse?.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refreshToken);
    }

    return user;
  },

  isAuthenticated() {
    return Boolean(this.getCurrentUser() && this.getToken());
  },

  hasRole(role) {
    return Boolean(this.getCurrentUser()?.roles?.includes(role));
  },

  hasAnyRole(roles = []) {
    const currentRoles = this.getCurrentUser()?.roles || [];
    return roles.some((role) => currentRoles.includes(role));
  },

  hasCmsAccessFromResponse(authResponse) {
    const roles = authResponse?.account?.roles || [];
    return CMS_ROLES.some((role) => roles.includes(role));
  },

  isAdmin() {
    return this.hasRole("ADMIN");
  },

  canWriteArticles() {
    return this.hasAnyRole(["ADMIN", "CONTENT_EDITOR"]);
  },

  canManageNotifications() {
    return this.hasAnyRole(["ADMIN", "NOTIFICATION_MANAGER"]);
  },
};

export default authService;
