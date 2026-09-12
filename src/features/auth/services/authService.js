import axiosClient from "@/shared/services/http/axiosClient";
import authStorage from "@/shared/services/auth/authStorage";

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
  checkIdentityAvailability({ identityType, identity }) {
    return axiosClient.post("/v1/auth/check-identity", {
      identityType,
      identity: identity?.trim(),
    });
  },

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

  requestPasswordReset(identity) {
    return axiosClient.post("/v1/auth/forgot-password", {
      identity: identity?.trim(),
    });
  },

  resendPasswordResetOtp(challengeId) {
    return axiosClient.post("/v1/auth/forgot-password/resend", { challengeId });
  },

  verifyPasswordResetOtp({ challengeId, otp }) {
    return axiosClient.post("/v1/auth/forgot-password/verify", {
      challengeId,
      otp,
    });
  },

  resetPassword({ challengeId, resetToken, newPassword }) {
    return axiosClient.post("/v1/auth/forgot-password/reset", {
      challengeId,
      resetToken,
      newPassword,
    });
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
      deviceLabel: "SSCare Web",
    });
  },

  logout() {
    authStorage.clear();
  },

  getCurrentUser() {
    const rawUser = authStorage.getItem(authStorage.keys.user);

    if (!rawUser) return null;

    try {
      return JSON.parse(rawUser);
    } catch {
      this.logout();
      return null;
    }
  },

  getToken() {
    return authStorage.getItem(authStorage.keys.token);
  },

  getRefreshToken() {
    return authStorage.getItem(authStorage.keys.refreshToken);
  },

  saveUser(authResponse, remember = false) {
    const user = normalizeSessionUser(authResponse);

    authStorage.saveLoginSession({
      user,
      accessToken: authResponse?.accessToken,
      refreshToken: authResponse?.refreshToken,
      remember,
    });

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
