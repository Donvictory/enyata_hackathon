import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getUserAuth,
  saveUserAuth,
  clearTokens,
  isAuthenticated,
  logout as storageLogout,
} from "../lib/storage";

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      await new Promise(r => setTimeout(r, 600));
      const user = { id: Date.now().toString(), ...userData };
      return { user };
    },
    onSuccess: (data) => {
      const user = data.user;
      if (user) {
        saveUserAuth(user);
        queryClient.setQueryData(["me"], user);
      }
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials) => {
      await new Promise(r => setTimeout(r, 600));
      const existingUser = getUserAuth();
      const user = existingUser || { id: "1", name: "Demo User", email: credentials.email };
      return { user };
    },
    onSuccess: (data) => {
      const user = data.user;
      if (user) {
        saveUserAuth(user);
        queryClient.setQueryData(["me"], user);
      }
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      return getUserAuth();
    },
    enabled: isAuthenticated(),
    retry: 1,
    staleTime: 0,
  });
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      await new Promise(r => setTimeout(r, 300));
      const existingUser = getUserAuth();
      const user = { ...existingUser, ...data };
      saveUserAuth(user);
      return { user };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      storageLogout();
    },
    onSettled: () => {
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ queryKey: ["me"] });
      navigate("/login", { replace: true });
    },
  });
};

export const useOnboard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      await new Promise(r => setTimeout(r, 500));
      const existingUser = getUserAuth();
      const user = { ...existingUser, ...data, isOnboarded: true };
      import("../lib/storage").then(s => s.saveUserProfile(user));
      saveUserAuth(user);
      return { user };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await new Promise(r => setTimeout(r, 500));
    },
    onSuccess: () => {
      localStorage.clear();
      clearTokens();
      queryClient.setQueryData(["me"], null);
    },
  });
};
