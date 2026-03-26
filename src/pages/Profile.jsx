"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Alert, AlertDescription } from "../Components/ui/alert";
import {
  getUserProfile,
  getDailyCheckIns,
  getPoints,
  logout,
} from "../lib/storage";
import {
  User,
  MapPin,
  Activity,
  Calendar,
  Heart,
  Trash2,
  Shield,
  Edit,
  Award,
  LogOut,
  Sparkles,
  Rocket,
  Globe,
  Database,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../Components/ui/alert-dialog";
import { motion } from "framer-motion";

import { useMe, useLogout, useDeleteAccount } from "../hooks/use-auth";
import { useDailyCheckIns } from "../hooks/use-daily-check-in";

export function Profile() {
  const navigate = useNavigate();
  const { data: profile, isLoading: isProfileLoading } = useMe();
  const logoutMutation = useLogout();
  const deleteAccountMutation = useDeleteAccount();

  const handleClearData = () => {
    deleteAccountMutation.mutate(null, {
      onSuccess: () => {
        toast.success("Account and all records purged. Hope to see you again!");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      },
      onError: () => {
        toast.error("Process failed. Please try again later.");
      },
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate(null, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        navigate("/login");
      },
    });
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-emerald-600 font-bold animate-pulse">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    navigate("/login");
    return null;
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen p-4 pb-24 bg-gray-50/50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-start mb-6 pt-6">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="ghost"
            className="rounded-2xl text-gray-400 hover:text-gray-900 group transition-all font-bold"
          >
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </Button>
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 pt-10"
        >
          <div className="relative inline-block">
            <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200 ring-4 ring-white">
              <User className="w-14 h-14 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-2xl shadow-lg border border-gray-100">
              <Shield className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 tracking-normal">
              {profile.name}
            </h1>
            <p className="text-gray-500 font-bold text-lg">{profile.email}</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs font-semibold text-gray-400 font-medium tracking-wide">
              <Calendar className="w-3 h-3" /> Joined {joinDate}
            </div>
          </div>
          <Button
            onClick={() => navigate("/edit-profile")}
            variant="outline"
            className="rounded-2xl border-gray-200 px-8 py-6 h-auto shadow-sm hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 font-bold transition-all text-base"
          >
            <Edit className="w-5 h-5 mr-3" />
            Edit Profile
          </Button>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Calendar,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              label: "Check-ins",
              val: profile?.totalCheckIns ?? 0,
            },
            {
              icon: Activity,
              color: "text-blue-600",
              bg: "bg-blue-50",
              label: "Current BMI",
              val: profile.bmi || "0.0",
              sub: `${profile.bmiCategory || "Normal"} (${profile.weight}kg · ${profile.height}cm)`,
            },
            {
              icon: Heart,
              color: "text-red-600",
              bg: "bg-red-50",
              label: "Years Old",
              val: profile.age,
            },
            {
              icon: Award,
              color: "text-yellow-600",
              bg: "bg-yellow-50",
              label: "Health XP",
              val: profile?.healthPoints ?? 0,
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="border-none shadow-xl bg-white rounded-3xl overflow-hidden"
            >
              <CardContent className="pt-8 text-center px-4 pb-8">
                <div
                  className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm`}
                >
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="text-3xl font-semibold text-gray-900">
                  {stat.val}
                </div>
                {stat.sub && (
                  <div className="text-sm text-opacity-80 font-semibold text-blue-500 uppercase tracking-normal -mt-1">
                    {stat.sub}
                  </div>
                )}
                <div className="text-sm text-opacity-80 font-semibold text-gray-400 font-medium tracking-wide mt-1">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-emerald-50/30 border-b border-gray-50 p-8">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Biological Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {[
                { label: "Full Name", val: profile.name },
                { label: "Phone", val: profile.phoneNumber || "Not provided" },
                { label: "Biological Sex", val: profile.gender, cap: true },
                { label: "Height", val: `${profile.height} cm` },
                { label: "Weight", val: `${profile.weight} kg` },
                { label: "Location", val: `${profile.city}, ${profile.state}` },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <span className="text-xs font-semibold text-gray-400 font-medium tracking-wide">
                    {item.label}
                  </span>
                  <span
                    className={`text-sm font-semibold text-gray-700 ${item.cap ? "capitalize" : ""}`}
                  >
                    {item.val}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-blue-50/30 border-b border-gray-50 p-8">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Medical Backdrop
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="text-xs font-semibold text-gray-400 font-medium tracking-wide">
                  Known Conditions
                </div>
                {profile.healthConditions?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.healthConditions.map((condition, i) => (
                      <span
                        key={`${condition}-${i}`}
                        className="px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold border border-red-200 shadow-sm"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-bold text-gray-400 bg-gray-50 p-4 rounded-2xl border border-dashed">
                    Zero clinical conditions reported
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="text-xs font-semibold text-gray-400 font-medium tracking-wide">
                  Genomic/Family History
                </div>
                {profile.familyHealthHistory?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.familyHealthHistory.map((item, i) => (
                      <span
                        key={`${item}-${i}`}
                        className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-200 shadow-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm font-bold text-gray-400 bg-gray-50 p-4 rounded-2xl border border-dashed">
                    No family predispositions recorded
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account & Performance Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Settings className="w-6 h-6 text-gray-400" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              <div className="space-y-3">
                {[
                  { label: "Notification Preferences", val: "Health Drift Alerts" },
                  { label: "Biometric Integration", val: "Enabled" },
                  { label: "Measurement System", val: "Metric (cm/kg)" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm font-bold text-gray-500 font-medium">
                      {item.label}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles size={24} className="text-yellow-500" />
                Next Check-in
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
              <p className="text-sm font-bold text-gray-600 leading-relaxed">
                Check back in tomorrow to update your health profile and keep your resilience tracking accurate.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/check-in")}
                disabled={profile.hasCompletedDailyChecks}
                className="rounded-xl w-full h-11 border-emerald-100 text-emerald-700 bg-emerald-50 font-bold"
              >
                {profile.hasCompletedDailyChecks ? "Checked-in for today" : "Proceed to Check-in"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Future Integrations */}
        <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-gray-50 p-8">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Rocket className="w-6 h-6 text-purple-600" />
              Strategic Horizon
            </CardTitle>
            <CardDescription className="text-gray-500 font-medium">
              Upcoming decentralized health integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: "EMR Sync",
                detail: "Helium Health Integration",
                icon: Database,
              },
              {
                label: "HMO Direct",
                detail: "AXA Mansard / Hygeia Connect",
                icon: Globe,
              },
              {
                label: "Wearables",
                detail: "Fitbit & Apple Watch SDK",
                icon: Activity,
              },
              {
                label: "Localization",
                detail: "Pidgin & Yoruba Voice AI",
                icon: Heart,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <item.icon className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-900 uppercase">
                    {item.label}
                  </div>
                  <div className="text-sm text-opacity-80 font-bold text-gray-400">
                    {item.detail}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-none shadow-2xl shadow-red-100/50 bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-red-50 p-8">
            <CardTitle className="text-xl text-red-600 font-semibold">
              System Termination
            </CardTitle>
            <CardDescription className="font-bold text-red-400/80">
              Irreversible destructive actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 flex flex-col md:flex-row gap-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex-1 h-16 rounded-[1.25rem] border-gray-200 font-semibold text-gray-600 hover:bg-gray-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex-1 h-16 rounded-[1.25rem] bg-red-600 hover:bg-red-700 font-semibold shadow-xl shadow-red-100"
                >
                  <Trash2 className="w-5 h-5 mr-3" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl p-8">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-semibold text-gray-900">
                    Absolute Termination?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-500 font-medium text-base">
                    You are about to permanently purge your profile,{" "}
                    {profile?.totalCheckIns ?? 0} records, and all AI insights.
                    This cannot be recovered.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="pt-6">
                  <AlertDialogCancel className="rounded-2xl h-12 font-bold border-gray-100">
                    Keep My History
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearData}
                    className="bg-red-600 hover:bg-red-700 rounded-2xl h-12 font-semibold shadow-lg shadow-red-100"
                  >
                    Yes, Purge Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ShieldCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
