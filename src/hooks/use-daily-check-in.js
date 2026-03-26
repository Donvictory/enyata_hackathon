import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/api-client";
import { getCheckInsLast7Days, getTodaysCheckIn } from "../lib/storage";

export const useCreateDailyCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post("/daily-check-ins", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["daily-check-ins"]);
      queryClient.invalidateQueries(["me"]);
    },
  });
};

export const useDailyCheckIns = () => {
  return useQuery({
    queryKey: ["daily-check-ins"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/daily-check-ins");
        return response.data.data.checkIns;
      } catch (error) {
        console.warn(
          "Backend check-ins fetch failed, using localStorage fallback.",
          error.message,
        );
        return getCheckInsLast7Days();
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTodayCheckIn = () => {
  return useQuery({
    queryKey: ["daily-check-ins", "today"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/daily-check-ins/today");
        return response.data.data.checkIn;
      } catch (error) {
        console.warn(
          "Backend today check-in fetch failed, using localStorage fallback.",
          error.message,
        );
        return getTodaysCheckIn();
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};
