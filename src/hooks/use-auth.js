import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import apiClient from "../lib/api-client";
import {
  getUserAuth,
  saveUserAuth,
  clearTokens,
  isAuthenticated,
} from "../lib/storage";

// ─── Register ──────────────────────────────────────────────────────────────────

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      const response = await apiClient.post("/users/register", userData);
      return response.data;
    },
    onSuccess: (data) => {
      const user = data.data?.user || data.user;
      // Tokens are already set as httpOnly cookies by the server.
      // We only persist the user object locally for offline / cold-start reads.
      if (user) {
        saveUserAuth(user);
        queryClient.setQueryData(["me"], user);
      }
    },
  });
};

// ─── Login ─────────────────────────────────────────────────────────────────────

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials) => {
      const response = await apiClient.post("/users/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      const user = data.data?.user || data.user;
      // Tokens are already set as httpOnly cookies by the server.
      if (user) {
        saveUserAuth(user);
        queryClient.setQueryData(["me"], user);
      }
    },
  });
};

// ─── "Who am I?" ───────────────────────────────────────────────────────────────
//
// This query is the source of truth for the currently authenticated user.
// The auth guards (ProtectedRoute / GuestRoute) consume it.

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/users/profile");
        const data = response.data?.data;
        let backendUser =
          data?.user || (response.data?.user ? response.data : null);

        // Fallback: if /profile didn't return the expected shape, try /me
        if (!backendUser) {
          const meResponse = await apiClient.get("/users/me");
          backendUser = meResponse.data?.data?.user || meResponse.data?.user;
        }

        if (backendUser) {
          const enrichedUser = {
            id: backendUser._id || backendUser.id,
            ...backendUser,
            ...data?.stats,
          };
          saveUserAuth(enrichedUser);
          return enrichedUser;
        }

        // No backend user returned
        return null;
      } catch (error) {
        if (error.response?.status === 401) {
          // Access token expired or missing — the interceptor will handle refresh.
          // Return null so guards can redirect.
          clearTokens();
          return null;
        }
        // Network / server errors: return null
        return null;
      }
    },
    // Only run this query when the browser has the session hint cookie.
    // This avoids an unnecessary 401 round-trip on first load for guests.
    enabled: isAuthenticated(),
    retry: 1,
    staleTime: 0, // Always verify session on mount/navigation
  });
};

// ─── Update Profile ────────────────────────────────────────────────────────────

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.patch("/users/me", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

// ─── Logout ────────────────────────────────────────────────────────────────────

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      // Ask the server to clear the httpOnly cookies
      await apiClient.post("/users/logout");
    },
    onSettled: () => {
      // Clear the client-side hint cookie + legacy localStorage
      clearTokens();
      // Wipe the React Query auth cache so all guards immediately redirect
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ queryKey: ["me"] });
      navigate("/login", { replace: true });
    },
  });
};

// ─── Onboard ───────────────────────────────────────────────────────────────────

export const useOnboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post("/users/onboard", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

// ─── Delete Account ────────────────────────────────────────────────────────────

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.delete("/users/me");
    },
    onSuccess: () => {
      localStorage.clear();
      clearTokens();
      queryClient.setQueryData(["me"], null);
    },
  });
};
