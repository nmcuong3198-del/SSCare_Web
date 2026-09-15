import axios from "axios";

import authStorage from "@/shared/services/auth/authStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const axiosClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

const clearSession = () => {
  authStorage.clear();
};

const saveRefreshedSession = (data) => {
  const currentUser = (() => {
    try {
      return JSON.parse(authStorage.getItem(authStorage.keys.user) || "{}");
    } catch {
      return {};
    }
  })();

  authStorage.updateSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: {
      ...currentUser,
      ...data.account,
      fullName: data.account?.fullName || data.account?.displayName,
      username: data.account?.email || data.account?.phone,
      accessToken: data.accessToken,
      accessTokenExpiresAt: data.accessTokenExpiresAt,
      refreshTokenExpiresAt: data.refreshTokenExpiresAt,
    },
  });
};

axiosClient.interceptors.request.use(
  (config) => {
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (typeof config.headers?.delete === "function") {
        config.headers.delete("Content-Type");
      } else if (config.headers) {
        delete config.headers["Content-Type"];
      }
    }

    const token = authStorage.getItem(authStorage.keys.token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = authStorage.getItem(authStorage.keys.refreshToken);
    const isAuthRequest = originalRequest?.url?.includes("/v1/auth/");
    const problemCode = error.response?.data?.code;

    // ADMIN chỉ được có một phiên đăng nhập. Khi một nơi khác đăng nhập thành công,
    // backend trả mã riêng để phiên cũ thoát ngay, không thử refresh token nữa.
    if (error.response?.status === 401 && problemCode === "AUTH_SESSION_REPLACED") {
      clearSession();
      window.dispatchEvent(
        new CustomEvent("auth:logout", { detail: { reason: "replaced" } }),
      );
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      refreshToken &&
      !originalRequest?._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${baseURL}/v1/auth/refresh`, {
              refreshToken,
              deviceLabel: "SSCare Web",
            })
            .then((response) => response.data)
            .finally(() => {
              refreshPromise = null;
            });
        }

        const refreshed = await refreshPromise;
        saveRefreshedSession(refreshed);
        originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        clearSession();
        const refreshProblemCode = refreshError.response?.data?.code;
        window.dispatchEvent(
          new CustomEvent("auth:logout", {
            detail: {
              reason: refreshProblemCode === "AUTH_SESSION_REPLACED"
                ? "replaced"
                : "expired",
            },
          }),
        );
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401 && !isAuthRequest) {
      clearSession();
      window.dispatchEvent(
        new CustomEvent("auth:logout", { detail: { reason: "expired" } }),
      );
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
