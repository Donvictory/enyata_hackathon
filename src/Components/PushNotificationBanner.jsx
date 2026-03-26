import { useState, useEffect } from "react";
import { Bell, X, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeUserToPush } from "../lib/push-notifications";
import { toast } from "sonner";

export function PushNotificationBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if notifications are supported and handled
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      // Only show if they haven't decided yet
      const dismissed = localStorage.getItem("push_banner_dismissed");
      if (!dismissed) {
        setIsVisible(true);
      }
    }
  }, []);

  const handleEnable = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await subscribeUserToPush();
      setIsVisible(false);
      toast.success("Health alerts enabled! 🚀");
    } else {
      setIsVisible(false);
      toast.error(
        "Notifications were blocked. You can enable them in browser settings.",
      );
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("push_banner_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden bg-emerald-900 text-white"
        >
          <div className="max-w-4xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="bg-emerald-500/20 p-3 rounded-2xl">
                <Bell className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <h4 className="font-black text-lg flex items-center gap-2 justify-center md:justify-start">
                  Enable Health Drift Alerts
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </h4>
                <p className="text-emerald-200/80 text-sm font-medium">
                  Get real-time notifications on your device when concerning
                  patterns are detected.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                onClick={handleEnable}
                className="flex-1 md:flex-none bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-xl px-8"
              >
                Enable
              </Button>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-emerald-300" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
