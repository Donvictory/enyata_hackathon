/**
 * DriftCare NG — Health Drift Detection Engine
 *
 * Detects behavioral drift from a personal 7-day baseline.
 * Maps to 4 Nigerian disease-risk patterns per PRD:
 *   1. Hypertension Risk   — stress + headache + poor sleep + family history
 *   2. Febrile Illness     — fever + fatigue + reduced activity + headache
 *   3. Stress & Burnout    — sustained stress + mood decline + poor sleep
 *   4. Diabetes Risk       — high BMI + low activity + fatigue + family history
 *
 * NOTE: This is NOT a diagnostic tool. It detects behavioral patterns only.
 */

/**
 * Normalise a single check-in record to a consistent internal shape,
 * regardless of whether it came from the backend or local storage.
 */
function normalise(c) {
  return {
    date: c.createdAt || c.date || new Date().toISOString(),
    // Backend names → internal names
    hoursSlept: parseFloat(c.hoursSlept) || 0,
    stressLevel: parseFloat(c.stressLevel) || 0,
    mood: parseFloat(c.currentMood ?? c.mood) || 0,
    physicalActivity:
      parseFloat(c.dailyActivityMeasure ?? c.physicalActivity) || 0,
    waterIntake: parseFloat(c.numOfWaterGlasses ?? c.waterIntake) || 0,
    healthStatus: (
      c.currentHealthStatus ||
      c.healthStatus ||
      "GOOD"
    ).toUpperCase(),
    symptoms: Array.isArray(c.symptomsToday)
      ? c.symptomsToday
      : Array.isArray(c.symptoms)
        ? c.symptoms
        : [],
    lifestyleChecks: Array.isArray(c.lifestyleChecks) ? c.lifestyleChecks : [],
  };
}

/**
 * Calculate a resilience score (0–100) for a single normalised record.
 *
 * Scoring (each out of 20):
 *   Sleep      — 8h target
 *   Mood       — 10-point scale → /10 * 20
 *   Low Stress — inverse of stress level
 *   Activity   — 30-min target
 *   Hydration  — 8 glasses target
 *
 * Penalty for bad health status or serious symptoms.
 */
function scoreRecord(r) {
  const sleep = Math.min((r.hoursSlept / 8) * 20, 20);
  const mood = Math.min((r.mood / 10) * 20, 20);
  const stress = Math.min(((10 - r.stressLevel) / 10) * 20, 20);
  const activity = Math.min((r.physicalActivity / 30) * 20, 20);
  const hydration = Math.min((r.waterIntake / 8) * 20, 20);

  let base = sleep + mood + stress + activity + hydration;

  // Health-status penalty
  if (r.healthStatus === "POOR" || r.healthStatus === "SICK") base -= 10;
  else if (r.healthStatus === "FAIR") base -= 4;

  // Symptom penalty (capped)
  const seriousSymptoms = [
    "FEVER",
    "CHEST_PAIN",
    "SEVERE_HEADACHE",
    "VOMITING",
  ];
  const seriousCount = r.symptoms.filter((s) =>
    seriousSymptoms.some((ss) => s.includes(ss)),
  ).length;
  base -= Math.min(seriousCount * 5, 15);

  // Lifestyle penalty
  if (r.lifestyleChecks.includes("SMOKED_TODAY")) base -= 3;
  if (r.lifestyleChecks.includes("DRANK_LAST_NIGHT")) base -= 3;

  return Math.max(0, Math.min(100, Math.round(base)));
}

/**
 * Average of an array of numbers, returns 0 for empty arrays.
 */
function avg(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

/**
 * Main drift detection function.
 * @param {Array} history  - Raw check-in records (any field-name style)
 * @param {Object} profile - User profile from backend
 * @returns {{ driftLevel: string, resilienceScore: number, alerts: Array, insights: Array }}
 */
export const detectDrift = (history, profile) => {
  if (!history || history.length === 0) {
    return {
      driftLevel: "none",
      resilienceScore: 100,
      alerts: [],
      insights: [],
    };
  }

  // 1. Normalise + sort chronologically
  const records = history
    .map(normalise)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // 2. Per-record resilience scores
  const scores = records.map(scoreRecord);

  // 3. Rolling resilience: weight recent records more
  //    Use last 7 days; if fewer records, use all.
  const window = records.slice(-7);
  const windowScores = scores.slice(-7);

  // Weighted average: most recent has highest weight
  const totalWeight = windowScores.reduce((s, _, i) => s + (i + 1), 0);
  const weightedScore =
    windowScores.reduce((s, v, i) => s + v * (i + 1), 0) / totalWeight;
  const resilienceScore = Math.round(Math.max(0, Math.min(100, weightedScore)));

  // 4. Trend analysis
  const latest = window[window.length - 1];
  const previous = window.slice(0, -1);

  // Recent (last 3) vs baseline (before that) for mood, stress, sleep
  const recent3 = window.slice(-3);
  const baseline = window.length > 3 ? window.slice(0, -3) : [window[0]];

  const recentMood = avg(recent3.map((r) => r.mood));
  const baselineMood = avg(baseline.map((r) => r.mood));
  const moodDrop = baselineMood - recentMood;

  const recentStress = avg(recent3.map((r) => r.stressLevel));
  const baselineStress = avg(baseline.map((r) => r.stressLevel));
  const stressRise = recentStress - baselineStress;

  const recentSleep = avg(recent3.map((r) => r.hoursSlept));
  const baselineSleep = avg(baseline.map((r) => r.hoursSlept));
  const sleepDrop = baselineSleep - recentSleep;

  const recentActivity = avg(recent3.map((r) => r.physicalActivity));

  // 5. Symptom presence in recent window
  const allRecentSymptoms = recent3.flatMap((r) => r.symptoms);
  const hasFever = allRecentSymptoms.some((s) => s.includes("FEVER"));
  const hasHeadache = allRecentSymptoms.some(
    (s) => s.includes("HEADACHE") || s.includes("HEAD"),
  );
  const hasFatigue = allRecentSymptoms.some(
    (s) =>
      s.includes("FATIGUE") || s.includes("TIRED") || s.includes("WEAKNESS"),
  );
  const hasChestPain = allRecentSymptoms.some((s) => s.includes("CHEST"));

  // Family history flags
  const familyHistory = profile?.familyHistory || [];
  const hasBPHistory = familyHistory.some(
    (h) =>
      h.includes("hypertension") ||
      h.includes("blood pressure") ||
      h.includes("BP"),
  );
  const hasDiabetesHistory = familyHistory.some(
    (h) => h.includes("diabetes") || h.includes("sugar"),
  );

  const bmi = parseFloat(profile?.bmi) || 0;

  // 6. Build alerts + insights via the 4 PRD drift patterns
  const alerts = [];
  const insights = [];

  // ── Pattern 1: Hypertension Risk ──────────────────────────────────────────
  const hypertensionSignals = [
    recentStress >= 7,
    hasHeadache,
    recentSleep < 5,
    hasBPHistory,
    hasChestPain,
    latest.physicalActivity < 10,
  ].filter(Boolean).length;

  if (hypertensionSignals >= 3) {
    alerts.push({
      pattern: "Hypertension Risk",
      severity: hypertensionSignals >= 4 ? "high" : "medium",
      message: `🩺 Hypertension risk signals detected — elevated stress, poor sleep, and headache pattern.`,
      recommendation:
        "Please check your blood pressure. Reduce salt, increase rest, and consult a doctor if BP is above 140/90.",
    });
  } else if (hypertensionSignals >= 2) {
    insights.push(
      "🩺 Some hypertension risk factors present (stress, poor sleep). Monitor your blood pressure.",
    );
  }

  // ── Pattern 2: Febrile Illness (Malaria-like) ─────────────────────────────
  const febrileSig = [
    hasFever,
    hasFatigue,
    recentActivity < 10,
    hasHeadache,
    latest.healthStatus === "SICK" || latest.healthStatus === "POOR",
  ].filter(Boolean).length;

  if (febrileSig >= 3) {
    alerts.push({
      pattern: "Febrile Illness",
      severity: hasFever ? "high" : "medium",
      message: `🌡️ Febrile illness pattern detected — fever, fatigue, and reduced activity.`,
      recommendation:
        "This pattern may indicate malaria or typhoid. Please get a rapid diagnostic test (RDT) immediately. Do not self-medicate.",
    });
  } else if (hasFever || (hasFatigue && recentActivity < 10)) {
    insights.push(
      "🌡️ Fatigue and reduced activity detected. Monitor for fever — get a malaria test if symptoms persist.",
    );
  }

  // ── Pattern 3: Stress & Burnout ───────────────────────────────────────────
  const burnoutSig = [
    recentStress >= 7,
    stressRise >= 2,
    moodDrop >= 1.5,
    sleepDrop >= 1.5,
    recentSleep < 5.5,
  ].filter(Boolean).length;

  if (burnoutSig >= 3) {
    alerts.push({
      pattern: "Stress & Burnout",
      severity: burnoutSig >= 4 ? "high" : "medium",
      message: `🧠 Stress and burnout drift detected — sustained high stress, mood decline, and disrupted sleep.`,
      recommendation:
        "Your cardiovascular and mental health are at risk. Schedule rest, reduce workload, and consider talking to a mental health professional.",
    });
  } else if (stressRise >= 1.5 || moodDrop >= 1) {
    insights.push(
      "🧠 Mood decline and rising stress detected. Prioritise sleep and short breaks throughout your day.",
    );
  }

  // ── Pattern 4: Diabetes Risk ──────────────────────────────────────────────
  const diabetesSig = [
    bmi > 27,
    avg(window.map((r) => r.physicalActivity)) < 15,
    hasFatigue,
    hasDiabetesHistory,
    avg(window.map((r) => r.waterIntake)) > 10, // excessive thirst proxy
  ].filter(Boolean).length;

  if (diabetesSig >= 3) {
    alerts.push({
      pattern: "Diabetes Risk",
      severity: diabetesSig >= 4 ? "high" : "medium",
      message: `🩸 Diabetes risk signals detected — low activity, high BMI, and fatigue pattern.`,
      recommendation:
        "Please get a fasting blood glucose test. Increase daily movement and reduce refined carbohydrate intake.",
    });
  } else if (bmi > 25 && avg(window.map((r) => r.physicalActivity)) < 20) {
    insights.push(
      "🩸 Low activity with elevated BMI. Regular 30-minute walks significantly reduce diabetes risk.",
    );
  }

  // 7. General positive insights
  if (recentMood >= 7 && recentStress <= 4) {
    insights.push("😊 Great mood and low stress this week — keep it up!");
  }
  if (recentSleep >= 7) {
    insights.push(
      "😴 Excellent sleep consistency — this is your biggest resilience driver.",
    );
  }
  if (avg(window.map((r) => r.waterIntake)) >= 7) {
    insights.push("💧 Good hydration levels — your body is well-supported.");
  }
  if (recentActivity >= 25) {
    insights.push(
      "🏃 Strong physical activity this week — your metabolic health thanks you.",
    );
  }

  // 8. Compute overall drift level from resilience score + alert severity
  const hasHighAlert = alerts.some((a) => a.severity === "high");
  const hasMediumAlert = alerts.some((a) => a.severity === "medium");

  let driftLevel;
  if (hasHighAlert || resilienceScore < 35) {
    driftLevel = "critical";
  } else if (hasMediumAlert || resilienceScore < 55) {
    driftLevel = "concern";
  } else if (resilienceScore < 75 || stressRise >= 1 || moodDrop >= 0.5) {
    driftLevel = "watch";
  } else {
    driftLevel = "optimal";
  }

  return {
    driftLevel,
    resilienceScore,
    alerts,
    insights,
  };
};

/**
 * Generate a contextual AI-companion message based on drift results.
 * Messages are PRD-aligned: encouraging early consultation, not fear.
 */
export const generateContextualMessage = (
  driftLevel,
  resilienceScore,
  profile,
) => {
  const name = profile?.name?.split(" ")[0] || "there";

  if (driftLevel === "none" || resilienceScore === 100) {
    return `No check-ins yet, ${name}. Complete your first daily check-in so I can start building your health baseline. It takes less than 60 seconds!`;
  }

  if (resilienceScore >= 80 && driftLevel === "optimal") {
    return `You're in great shape, ${name}! Your resilience tank is full and your patterns are stable. Keep your current sleep and hydration habits — they're your biggest wins. 💪`;
  }

  if (driftLevel === "critical") {
    return `${name}, your recent patterns show significant drift. Please review the alerts below and consider consulting a doctor or taking a full rest day. Early action makes all the difference. 🩺`;
  }

  if (driftLevel === "concern") {
    return `Hi ${name}, I've noticed some concerning shifts in your health patterns over the past few days. Focus on sleep and hydration first — these are the fastest levers. ⚡`;
  }

  if (driftLevel === "watch") {
    return `${name}, things are mostly stable but there are minor drifts worth monitoring. Keep your check-in streak going — consistent data gives me better insights. 👀`;
  }

  return `Welcome back, ${name}. Your data is looking reasonable. Keep logging daily check-ins to unlock deeper drift insights and personalised alerts. 📊`;
};
