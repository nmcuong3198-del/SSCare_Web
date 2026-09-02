import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";
const LOGIN_AT_KEY = "loginAt";

const axiosClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;

const clearSession = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(LOGIN_AT_KEY);
};

const saveRefreshedSession = (data) => {
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
    } catch {
      return {};
    }
  })();

  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      ...currentUser,
      ...data.account,
      fullName: data.account?.displayName,
      username: data.account?.email || data.account?.phone,
      accessToken: data.accessToken,
      accessTokenExpiresAt: data.accessTokenExpiresAt,
      refreshTokenExpiresAt: data.refreshTokenExpiresAt,
    }),
  );
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

    const token = localStorage.getItem(TOKEN_KEY);

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
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const isAuthRequest = originalRequest?.url?.includes("/v1/auth/");

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
        window.dispatchEvent(
          new CustomEvent("auth:logout", { detail: { reason: "expired" } }),
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
