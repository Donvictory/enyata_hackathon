import { useMemo, useState, useEffect } from "react";
import { useDailyCheckIns, useTodayCheckIn } from "./use-daily-check-in";
import { useMe } from "./use-auth";
import { detectDrift } from "../lib/drift-detection";

export const useNotifications = () => {
  const { data: profile } = useMe();
  const { data: checkIns } = useDailyCheckIns();
  const { data: todayCheckIn } = useTodayCheckIn();

  const [lastViewed, setLastViewed] = useState(() => {
    return (
      localStorage.getItem("notifications_last_viewed") ||
      new Date(0).toISOString()
    );
  });

  const notifications = useMemo(() => {
    const list = [];

    // 1. Health Alerts from Drift Detection
    if (checkIns && profile) {
      const drift = detectDrift(checkIns, profile);
      drift.alerts.forEach((alert, idx) => {
        list.push({
          id: `alert-${idx}-${alert.pattern}`,
          type: "alert",
          title: alert.pattern,
          message: alert.message,
          severity: alert.severity,
          timestamp: new Date().toISOString(), // In a real app, this would be the detected time
          icon: "alert",
        });
      });
    }

    // 2. Reminders
    if (!todayCheckIn) {
      list.push({
        id: "reminder-check-in",
        type: "reminder",
        title: "Daily Check-in",
        message: "You haven't completed your health check-in for today yet.",
        severity: "medium",
        timestamp: new Date().toISOString(),
        icon: "calendar",
      });
    }

    // 3. Welcome / Points notifications
    if (profile?.healthPoints > 0) {
      list.push({
        id: "points-info",
        type: "info",
        title: "Milestone Reached",
        message: `You've earned ${profile.healthPoints} Health XP! Keep up the good work.`,
        severity: "low",
        timestamp: profile.updatedAt || new Date().toISOString(),
        icon: "award",
      });
    }

    // 4. Remedy Tasks Ready (After Check-in)
    if (todayCheckIn) {
      list.push({
        id: `remedy-ready-${new Date().toISOString().split("T")[0]}`,
        type: "success",
        title: "Remedies Generated",
        message:
          "New personalized health tasks are ready based on today's vitals.",
        severity: "low",
        timestamp:
          todayCheckIn.createdAt ||
          todayCheckIn.date ||
          new Date().toISOString(),
        icon: "sparkles",
      });
    }

    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [checkIns, profile, todayCheckIn]);

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (n) => new Date(n.timestamp) > new Date(lastViewed),
    ).length;
  }, [notifications, lastViewed]);

  const markAllAsRead = () => {
    const now = new Date().toISOString();
    setLastViewed(now);
    localStorage.setItem("notifications_last_viewed", now);
  };

  return {
    notifications,
    unreadCount,
    markAllAsRead,
  };
};
