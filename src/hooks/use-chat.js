import { useMutation } from "@tanstack/react-query";
import { getTodaysCheckIn, getCheckInsLast7Days } from "../lib/storage";
import { calculateResilienceScore } from "../lib/drift-detection";

export const useAskCompanion = () => {
  return useMutation({
    mutationFn: async (message) => {
      await new Promise((r) => setTimeout(r, 1200));

      const today = getTodaysCheckIn();
      const score = today?.resilienceScore ?? 0;
      const lowerMessage = message.toLowerCase();

      // Check if user is asking about their status or tank
      if (lowerMessage.includes("tank") || lowerMessage.includes("resilience") || lowerMessage.includes("how am i doing")) {
        if (!today) {
           return "I don't have your resilience data for today yet! Please complete a Daily Check-in so I can see your tank level. 📊";
        }
        return `Your Resilience Tank is currently at ${score}%. ${score > 80 ? "You're in peak condition!" : score > 50 ? "You're doing okay, but watch your stress." : "Your tank is quite low – please prioritize resting today."} 🔋`;
      }

      return `I've analyzed your current health data (your Resilience Tank is at ${score}%). Regarding "${message}": I'm here to help with health advice tailored to you.`;
    },
  });
};
