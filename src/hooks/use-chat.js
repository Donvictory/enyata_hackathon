import { useMutation } from "@tanstack/react-query";

export const useAskCompanion = () => {
  return useMutation({
    mutationFn: async (message) => {
      await new Promise(r => setTimeout(r, 800));
      return "I'm your local AI companion. You said: " + message;
    },
  });
};
