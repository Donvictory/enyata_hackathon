/**
 * LocalStorage wrapper for AI-HEALTHCARE persistence
 */

const STORAGE_KEYS = {
  AUTH: "auth_session",
  PROFILE: "user_profile",
  CHECK_INS: "daily_checkins",
  MESSAGES: "chat_history",
  TASKS: "health_tasks",
  POINTS: "user_points",
  MEDICAL_REPORTS: "medical_reports",
  REMEDY_TASKS: "remedy_tasks",
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};

// --- AUTHENTICATION ---
export const saveUserAuth = (userData) => {
  localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(userData));
};

export const getUserAuth = () => {
  const data = localStorage.getItem(STORAGE_KEYS.AUTH);
  return data ? JSON.parse(data) : null;
};

export const saveTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

export const getAccessToken = () =>
  localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
export const getRefreshToken = () =>
  localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

export const clearTokens = () => {
  // Remove any legacy localStorage copies
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  // Also expire the client-visible hint cookies so guards instantly see the
  // logged-out state without waiting for an API round-trip.
  expireCookie("is_logged_in");
  expireCookie("is_onboarded");
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

/**
 * Expire a non-httpOnly cookie from JavaScript by setting its Max-Age to 0.
 * (The server clears the httpOnly tokens via the /logout endpoint.)
 */
const expireCookie = (name) => {
  const base = `${name}=; Max-Age=0; path=/;`;
  document.cookie = `${base} SameSite=Lax`;
  document.cookie = `${base} SameSite=None; Secure`;
  document.cookie = `${base} SameSite=Strict`;
};

export const isAuthenticated = () => {
  // Check for the non-httpOnly hint cookie set by the server after login.
  // This is the primary signal — no localStorage required.
  return getCookie("is_logged_in") === "true";
};

export const isOnboarded = () => {
  // Check for the non-httpOnly hint cookie set by the server.
  return getCookie("is_onboarded") === "true";
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  clearTokens(); // clears localStorage + is_logged_in cookie
  // NOTE: Navigation to /login is handled by the React Router auth guards
  // after useLogout() clears the React Query 'me' cache. Avoid hard reloads
  // here; they bypass the SPA router and reset all query caches.
};

// --- PROFILE & ONBOARDING ---
export const saveUserProfile = (profile) => {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

export const getUserProfile = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (data) return JSON.parse(data);
  return null;
};

export const hasCompletedOnboarding = () => {
  const profile = getUserProfile();
  // If we have a backend token but no local profile yet, we might still be onboarded
  // This is a temporary bridge until all components use React Query
  return !!(profile && profile.age);
};

export const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

// --- CHECK-INS ---
export const saveDailyCheckIn = (checkInData) => {
  const history = getDailyCheckIns();
  const today = new Date().toISOString().split("T")[0];
  const updated = history.filter((c) => c.date !== today);
  updated.push({ ...checkInData, date: today });
  localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(updated));

  // Award points for check-in
  addPoints(10);
};

export const getDailyCheckIns = () => {
  const data = localStorage.getItem(STORAGE_KEYS.CHECK_INS);
  return data ? JSON.parse(data) : [];
};

export const getTodaysCheckIn = () => {
  const history = getDailyCheckIns();
  const today = new Date().toISOString().split("T")[0];
  return history.find((c) => c.date === today) || null;
};

export const getCheckInsLast7Days = () => {
  const history = getDailyCheckIns();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return history.filter((c) => new Date(c.date) >= sevenDaysAgo);
};

// --- GAMIFICATION & POINTS ---
export const getPoints = () => {
  const data = localStorage.getItem(STORAGE_KEYS.POINTS);
  return data ? parseInt(data) : 0;
};

export const addPoints = (amount) => {
  const current = getPoints();
  localStorage.setItem(STORAGE_KEYS.POINTS, (current + amount).toString());
};

export const deductPoints = (amount) => {
  const current = getPoints();
  localStorage.setItem(
    STORAGE_KEYS.POINTS,
    Math.max(0, current - amount).toString(),
  );
};

// --- TASKS ---
export const getHealthTasks = () => {
  const data = localStorage.getItem(STORAGE_KEYS.TASKS);
  if (data) return JSON.parse(data);

  // Default tasks if none exist
  const defaults = [
    { id: 1, title: "Drink 8 glasses of water", completed: false, points: 5 },
    { id: 2, title: "15-minute morning stretch", completed: false, points: 10 },
    { id: 3, title: "Record afternoon mood", completed: false, points: 5 },
  ];
  saveHealthTasks(defaults);
  return defaults;
};

const saveHealthTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const toggleHealthTask = (taskId) => {
  const tasks = getHealthTasks();
  let status = null; // true for completed, false for undone
  const updated = tasks.map((t) => {
    if (t.id === taskId) {
      if (!t.completed) {
        addPoints(t.points);
        status = true;
        return { ...t, completed: true };
      } else {
        deductPoints(t.points);
        status = false;
        return { ...t, completed: false };
      }
    }
    return t;
  });
  saveHealthTasks(updated);
  return status;
};

// --- REMEDY TASKS (generated daily from check-in) ---
export const saveRemedyTasks = (tasks) => {
  const today = new Date().toISOString().split("T")[0];
  const payload = { date: today, tasks };
  localStorage.setItem(STORAGE_KEYS.REMEDY_TASKS, JSON.stringify(payload));
};

export const getRemedyTasks = () => {
  const data = localStorage.getItem(STORAGE_KEYS.REMEDY_TASKS);
  if (!data) return [];
  const payload = JSON.parse(data);
  const today = new Date().toISOString().split("T")[0];
  // Expire remedy tasks after the day they were generated
  if (payload.date !== today) return [];
  return payload.tasks || [];
};

export const toggleRemedyTask = (taskId) => {
  const data = localStorage.getItem(STORAGE_KEYS.REMEDY_TASKS);
  if (!data) return null;
  const payload = JSON.parse(data);
  let status = null;
  payload.tasks = payload.tasks.map((t) => {
    if (t.id === taskId) {
      if (!t.completed) {
        addPoints(t.points);
        status = true;
        return { ...t, completed: true };
      } else {
        deductPoints(t.points);
        status = false;
        return { ...t, completed: false };
      }
    }
    return t;
  });
  localStorage.setItem(STORAGE_KEYS.REMEDY_TASKS, JSON.stringify(payload));
  return status;
};

// --- CHAT ---
export const saveChatMessage = (message) => {
  const history = getChatMessages();
  history.push({ ...message, timestamp: new Date().toISOString() });
  localStorage.setItem(
    STORAGE_KEYS.MESSAGES,
    JSON.stringify(history.slice(-50)),
  );
};

export const getChatMessages = () => {
  const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
  return data
    ? JSON.parse(data)
    : [
        {
          role: "assistant",
          content: "Hello! I am your Companion. How can I help you today?",
          timestamp: new Date().toISOString(),
        },
      ];
};

// --- MEDICAL REPORTS ---
export const saveMedicalReport = (report) => {
  const reports = getMedicalReports();
  reports.push(report);
  localStorage.setItem(STORAGE_KEYS.MEDICAL_REPORTS, JSON.stringify(reports));
};

export const getMedicalReports = () => {
  const data = localStorage.getItem(STORAGE_KEYS.MEDICAL_REPORTS);
  return data ? JSON.parse(data) : [];
};
