import { useNavigate, useLocation } from "react-router-dom";
import {
  Activity,
  Bell,
  Settings,
  X,
  AlertTriangle,
  Calendar,
  Award,
  Info,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNotifications } from "../hooks/use-notifications";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../Components/ui/popover";
import { Button } from "./ui/button";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const requestPushPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("DriftCare Enabled", {
          body: "You will now receive important health drift alerts.",
          icon: "/logo.svg",
        });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/5 rounded-3xl px-6 py-3 flex items-center justify-between">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <div className="bg-emerald-600 p-2 rounded-2xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-gray-900 leading-none">
                DRIFT<span className="text-emerald-600">CARE</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5">
                Next-Gen Health
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation Hints */}
          <div className="hidden md:flex items-center gap-8">
            {/* Navigation links removed to favor dashboard-centric interaction */}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <button
                  onClick={() => markAllAsRead()}
                  className="relative p-2.5 rounded-2xl bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-[10px] font-black text-white rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-80 p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-3xl"
              >
                <div className="p-5 border-b border-gray-100 bg-emerald-50/30 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-gray-900">
                      Notifications
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Health Alerts & Reminders
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-white text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-4 hover:bg-gray-50/50 transition-colors flex gap-4"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              n.type === "alert"
                                ? "bg-red-50 text-red-600"
                                : n.type === "reminder"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {n.icon === "alert" ? (
                              <AlertTriangle className="w-5 h-5" />
                            ) : n.icon === "calendar" ? (
                              <Calendar className="w-5 h-5" />
                            ) : n.icon === "award" ? (
                              <Award className="w-5 h-5" />
                            ) : n.icon === "sparkles" ? (
                              <Sparkles className="w-5 h-5" />
                            ) : (
                              <Info className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-black text-gray-900 truncate">
                              {n.title}
                            </div>
                            <p className="text-[11px] font-medium text-gray-500 leading-snug mt-0.5">
                              {n.message}
                            </p>
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tight mt-2 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              {new Date(n.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 text-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-xs font-bold text-gray-400">
                        All caught up!
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                  <Button
                    onClick={requestPushPermission}
                    className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100"
                  >
                    Enable Push Alerts
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <button
              onClick={() => navigate("/profile")}
              className="p-2.5 rounded-2xl bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-2xl bg-emerald-100 border-2 border-white shadow-md cursor-pointer overflow-hidden flex items-center justify-center hover:scale-105 transition-transform"
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
