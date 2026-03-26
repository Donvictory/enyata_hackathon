import axios from "axios";
import { isAuthenticated, clearTokens } from "./storage";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true, // always send/receive cookies
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor – tokens live in httpOnly cookies so nothing extra needed.
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Response interceptor – handles 401 by attempting a silent token refresh.
//
// Tokens are stored exclusively as httpOnly cookies, so:
//   • we never read tokens from localStorage
//   • we use the non-httpOnly `is_logged_in` hint cookie to decide if a
//     session SHOULD exist before making a refresh request (saves a round-trip)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Never try to refresh the refresh-token endpoint itself (infinite loop guard)
    if (
      originalRequest.url?.includes("/users/refresh-token") ||
      originalRequest._retry
    ) {
      if (originalRequest.url?.includes("/users/refresh-token")) {
        // Refresh endpoint itself returned 401 → session is dead
        clearTokens();
        window.location.replace("/login");
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If the hint cookie says there is no active session, skip the refresh
      // attempt and redirect immediately — saves a round-trip to the server.
      if (!isAuthenticated()) {
        clearTokens();
        window.location.replace("/login");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue any other parallel requests until the refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // The refreshToken httpOnly cookie is sent automatically by the browser
        await axios.post(
          `${apiClient.defaults.baseURL}/users/refresh-token`,
          {},
          { withCredentials: true },
        );

        isRefreshing = false;
        processQueue(null);

        // Retry the original request – the new accessToken cookie is now set
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        clearTokens();
        window.location.replace("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
