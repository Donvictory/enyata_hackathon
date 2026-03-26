import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCheckInsLast7Days, getTodaysCheckIn } from "../lib/storage";

export const useCreateDailyCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      await new Promise(r => setTimeout(r, 600));
      return { success: true };
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
      return getCheckInsLast7Days();
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTodayCheckIn = () => {
  return useQuery({
    queryKey: ["daily-check-ins", "today"],
    queryFn: async () => {
      return getTodaysCheckIn();
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};
