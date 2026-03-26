import { createBrowserRouter } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/SignUp";
import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { DailyCheckIn } from "./pages/DailyCheckIn";
import { Profile } from "./pages/Profile";
import { EditProfile } from "./pages/EditProfile";
import { DoctorFinder } from "./pages/DoctorFinder";
import { HealthChat } from "./pages/HealthChat";
import { NotFound } from "./pages/NotFound";
import { Layout } from "./Components/Layout";
import { LandingPage } from "./pages/LandingPage";
import {
  ProtectedRoute,
  GuestRoute,
  OnboardingRoute,
} from "./Components/AuthGuards";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      {
        path: "login",
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <GuestRoute>
            <Signup />
          </GuestRoute>
        ),
      },
      {
        path: "onboarding",
        element: (
          <OnboardingRoute>
            <Onboarding />
          </OnboardingRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "check-in",
        element: (
          <ProtectedRoute>
            <DailyCheckIn />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-profile",
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "find-doctor",
        element: (
          <ProtectedRoute>
            <DoctorFinder />
          </ProtectedRoute>
        ),
      },
      {
        path: "health-chat",
        element: (
          <ProtectedRoute>
            <HealthChat />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
