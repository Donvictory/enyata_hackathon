/**
 * DriftCare NG — Personalized Remedy Task Generator
 *
 * Generates 4 daily remedy tasks based on the user's latest check-in.
 * Tasks are unique to each user's health profile and reset each day.
 * Points are randomized between 3–10 per task.
 *
 * NOT a treatment plan — tasks are lifestyle nudges only.
 */

/** Deterministic seeded random — same seed → same numbers for the same day */
function seededRand(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Random integer between min and max (inclusive), using seeded RNG */
function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** Pick N unique items from an array using seeded RNG, preserving order */
function pickUnique(rng, pool, n) {
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, n);
}

/**
 * All available remedy task templates, tagged by the health issue they address.
 * Each template is a function(profile) → { title, description, icon }
 */
const TASK_POOL = {
  // ── Pattern 1: Hypertension Risk (PRD Pattern) ──────────────────────────────
  hypertension_risk: [
    {
      title: "Check your blood pressure now",
      description:
        "Stress + headache + poor sleep detected. If BP is >140/90, please rest and consult a doctor.",
      icon: "🩺",
    },
    {
      title: "Zero-salt day starting now",
      description:
        "Sodium spikes blood pressure. Stick to natural flavors like lemon or garlic today.",
      icon: "🚫",
    },
    {
      title: "Hibiscus (Zobo) tea without sugar",
      description:
        "Unsweetened hibiscus tea is shown to naturally support healthy blood pressure levels.",
      icon: "🍵",
    },
    {
      title: "20-minute guided relaxation",
      description:
        "Lowering your heart rate through deep breathing can acutely lower blood pressure.",
      icon: "🧘",
    },
  ],

  // ── Pattern 2: Febrile Illness (PRD Pattern) ─────────────────────────────────
  febrile_illness: [
    {
      title: "Get a Malaria RDT test",
      description:
        "Fever + fatigue detected. Visit a pharmacy for a Rapid Diagnostic Test immediately.",
      icon: "🌡️",
    },
    {
      title: "Hydrate with ORS or coconut water",
      description:
        "Febrile illness causes rapid fluid loss. Replace electrolytes immediately.",
      icon: "🥥",
    },
    {
      title: "Complete bed rest for 12 hours",
      description:
        "Your immune system needs all your energy. No work, no screens, just recovery.",
      icon: "🛌",
    },
    {
      title: "Stay in a well-ventilated, cool space",
      description:
        "Keep your body temperature stable. Avoid heavy blankets if you have a fever.",
      icon: "🌬️",
    },
  ],

  // ── Pattern 3: Stress & Burnout (PRD Pattern) ────────────────────────────────
  stress_burnout: [
    {
      title: "Delete one non-essential task today",
      description:
        "Burnout risk detected. Protect your mental energy by saying 'no' to one thing today.",
      icon: "✂️",
    },
    {
      title: "15-minute 'No-Phone' morning",
      description:
        "The first hour of your day sets your cortisol. Keep the digital world away.",
      icon: "📵",
    },
    {
      title: "Journal: What's draining you?",
      description:
        "Naming the source of stress reduces its power. Write it down for 5 minutes.",
      icon: "✍️",
    },
    {
      title: "Call a supportive family member",
      description:
        "Social support is the strongest buffer against psychological burnout.",
      icon: "📞",
    },
  ],

  // ── Pattern 4: Diabetes Risk (PRD Pattern) ───────────────────────────────────
  diabetes_risk: [
    {
      title: "Fast for 12 hours tonight",
      description:
        "Giving your insulin a break helps improve sensitivity. Stop eating by 8 PM.",
      icon: "🌙",
    },
    {
      title: "Swap white rice for local beans/legumes",
      description:
        "Lower the glycemic load of your meal to prevent blood sugar spikes.",
      icon: "🥘",
    },
    {
      title: "Brisk walk immediately after dinner",
      description:
        "Muscles burn glucose best right after you eat. Even 15 minutes makes a difference.",
      icon: "🏃",
    },
    {
      title: "Check blood sugar at a pharmacy",
      description:
        "Early detection of pre-diabetes allows for 100% reversal through lifestyle.",
      icon: "💉",
    },
  ],

  // ── Sleep Issues ────────────────────────────────────────────────────────────
  poor_sleep: [
    {
      title: "No screens 30 min before bed",
      description:
        "Blue light suppresses melatonin. Put devices away by 9:30 PM tonight.",
      icon: "🌙",
    },
    {
      title: "Set a consistent bedtime alarm",
      description:
        "Your circadian rhythm strengthens with regularity. Aim for the same bedtime.",
      icon: "⏰",
    },
    {
      title: "Try Magnesium-rich food tonight",
      description:
        "Bananas, almonds, or leafy greens help relax muscles for better sleep.",
      icon: "🍌",
    },
  ],

  // ── High Stress (General) ────────────────────────────────────────────────────
  high_stress: [
    {
      title: "5-minute box breathing session",
      description:
        "Inhale 4s -> Hold 4s -> Exhale 4s -> Hold 4s. Reduces cortisol fast.",
      icon: "🧘",
    },
    {
      title: "Take a 15-min outdoor walk",
      description: "Daylight + movement drops cortisol and boosts serotonin.",
      icon: "🚶",
    },
  ],

  // ── Low Activity ─────────────────────────────────────────────────────────────
  low_activity: [
    {
      title: "Home workout: 3 sets of 10 squats",
      description:
        "Big muscle movement is the best way to wake up your metabolism.",
      icon: "🏋️",
    },
    {
      title: "Park further away or walk the long way",
      description:
        "Add 500 extra steps to your day through simple 'active' choices.",
      icon: "🛣️",
    },
  ],

  // ── Dehydration ──────────────────────────────────────────────────────────────
  dehydration: [
    {
      title: "Drink a full glass of water now",
      description: "Start a hydration cascade. Your kidneys will thank you.",
      icon: "💧",
    },
    {
      title: "Carry a 1L water bottle today",
      description:
        "Visual cues are the best way to ensure you actually drink water.",
      icon: "🍼",
    },
  ],

  // ── Poor Mood ────────────────────────────────────────────────────────────────
  low_mood: [
    {
      title: "Morning light for 15 minutes",
      description:
        "Natural light resets your mood-regulating hormones. Go outside early.",
      icon: "☀️",
    },
    {
      title: "Listen to your favorite upbeat song",
      description: "Audio-therapy is a fast way to shift your emotional state.",
      icon: "🎵",
    },
  ],

  // ── Fatigue / Febrile Symptoms ───────────────────────────────────────────────
  fatigue: [
    {
      title: "Power nap: 20 minutes only",
      description:
        "Short naps restore cognitive function without the 'sleep drunkenness'.",
      icon: "😴",
    },
  ],

  // ── Headache ─────────────────────────────────────────────────────────────────
  headache: [
    {
      title: "Stay away from bright lights",
      description:
        "Photophobia often accompanies headaches. Opt for soft, dim lighting.",
      icon: "💡",
    },
  ],

  // ── Smoking / Alcohol ────────────────────────────────────────────────────────
  smoking: [
    {
      title: "Hold off for 1 hour after waking",
      description:
        "Breaking the immediate morning habit is the first step to control.",
      icon: "⏳",
    },
  ],

  alcohol: [
    {
      title: "Double your water intake today",
      description:
        "Alcohol is a diuretic. Your body needs 2x water to recover.",
      icon: "💧",
    },
  ],

  // ── High BMI (General) ───────────────────────────────────────────────────────
  high_bmi: [
    {
      title: "Zero fizzy drinks today",
      description:
        "Sugar in liquids is the fastest driver of weight gain and insulin resistance.",
      icon: "🚫",
    },
  ],

  // ── General Wellness ─────────────────────────────────────────────────────────
  general: [
    {
      title: "Take 5 deep breaths right now",
      description:
        "Conscious breathing activates your recovery system. Do it now.",
      icon: "🌬️",
    },
    {
      title: "Eat one more green vegetable",
      description:
        "Fiber feeds your gut microbiome, which controls 70% of your immunity.",
      icon: "🥬",
    },
  ],
};

/**
 * Determine which task categories are most relevant for this check-in.
 * Returns an ordered list of category keys (most urgent first).
 */
function rankCategories(checkIn, profile) {
  const scores = [];

  const sleep = parseFloat(checkIn.hoursSlept) || 0;
  const stress = parseFloat(checkIn.stressLevel) || 0;
  const mood = parseFloat(checkIn.mood ?? checkIn.currentMood) || 0;
  const activity =
    parseFloat(checkIn.physicalActivity ?? checkIn.dailyActivityMeasure) || 0;
  const water =
    parseFloat(checkIn.waterIntake ?? checkIn.numOfWaterGlasses) || 0;
  const bmi = parseFloat(profile?.bmi) || 0;
  const symptoms = [
    ...(Array.isArray(checkIn.symptomsToday) ? checkIn.symptomsToday : []),
    ...(Array.isArray(checkIn.symptoms) ? checkIn.symptoms : []),
  ];
  const lifestyle = Array.isArray(checkIn.lifestyleChecks)
    ? checkIn.lifestyleChecks
    : [];
  const health = (
    checkIn.currentHealthStatus ||
    checkIn.healthStatus ||
    "GOOD"
  ).toUpperCase();
  const familyHistory = profile?.familyHistory || [];

  const hasFever = symptoms.some((s) => s.match(/FEVER/i));
  const hasHeadache = symptoms.some((s) => s.match(/HEADACHE|HEAD/i));
  const hasFatigue = symptoms.some((s) => s.match(/FATIGUE|TIRED|WEAKNESS/i));
  const hasChestPain = symptoms.some((s) => s.match(/CHEST/i));

  // ── 4 CLINICAL DRIFT PATTERNS (Highest Priority) ──

  // 1. Hypertension Risk
  const hbSignals = [
    stress >= 7.5,
    hasHeadache,
    sleep < 5.5,
    familyHistory.some((h) => /hypertension|bp|pressure/i.test(h)),
    hasChestPain,
  ].filter(Boolean).length;
  if (hbSignals >= 3) scores.push({ key: "hypertension_risk", score: 15 });

  // 2. Febrile Illness
  const feverSignals = [
    hasFever,
    hasFatigue,
    activity < 10,
    hasHeadache,
    health === "SICK",
  ].filter(Boolean).length;
  if (feverSignals >= 3) scores.push({ key: "febrile_illness", score: 12 });

  // 3. Stress & Burnout
  const burnoutSignals = [
    stress >= 8,
    mood <= 4,
    sleep < 5,
    health === "POOR",
  ].filter(Boolean).length;
  if (burnoutSignals >= 3) scores.push({ key: "stress_burnout", score: 11 });

  // 4. Diabetes Risk
  const diabetesSignals = [
    bmi > 27,
    activity < 15,
    hasFatigue,
    familyHistory.some((h) => /diabetes|sugar/i.test(h)),
  ].filter(Boolean).length;
  if (diabetesSignals >= 3) scores.push({ key: "diabetes_risk", score: 10 });

  // ── BEHAVIORAL DEVIATIONS ──
  if (sleep < 5) scores.push({ key: "poor_sleep", score: 9 });
  if (stress >= 7) scores.push({ key: "high_stress", score: 8 });
  if (mood <= 4) scores.push({ key: "low_mood", score: 8 });
  if (activity < 10) scores.push({ key: "low_activity", score: 7 });
  if (water < 5) scores.push({ key: "dehydration", score: 7 });
  if (hasHeadache) scores.push({ key: "headache", score: 7 });

  if (lifestyle.includes("SMOKED_TODAY"))
    scores.push({ key: "smoking", score: 6 });
  if (lifestyle.includes("DRANK_LAST_NIGHT"))
    scores.push({ key: "alcohol", score: 6 });

  // Always pad with general
  scores.push({ key: "general", score: 1 });

  // Sort by urgency, dedup by key
  const seen = new Set();
  return scores
    .sort((a, b) => b.score - a.score)
    .filter(({ key }) => (seen.has(key) ? false : seen.add(key)))
    .map(({ key }) => key);
}

/**
 * Main export: generate 4 unique remedy tasks from a check-in.
 *
 * @param {Object} checkIn  - Today's normalized check-in record
 * @param {Object} profile  - User profile
 * @returns {Array}         - Array of 4 task objects { id, title, description, icon, points, completed, isRemedy }
 */
export function generateRemedyTasks(checkIn, profile) {
  if (!checkIn) return [];

  // Seed the RNG with today's date + user ID for reproducibility within the same day
  const today = new Date().toISOString().split("T")[0]; // "2026-02-22"
  const userId = profile?._id || profile?.id || "anon";
  const seedStr = today + userId;
  let seedNum = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seedNum = (seedNum * 31 + seedStr.charCodeAt(i)) & 0xfffffff;
  }
  const rng = seededRand(seedNum || 42);

  // Rank categories by urgency
  const rankedCategories = rankCategories(checkIn, profile);

  // Pick 4 tasks, one from each top category
  const tasks = [];
  const usedCategories = new Set();

  for (const category of rankedCategories) {
    if (tasks.length >= 4) break;
    if (usedCategories.has(category)) continue;

    const pool = TASK_POOL[category];
    if (!pool || pool.length === 0) continue;

    // Pick one task from the pool (seeded so it's consistent for the day)
    const idx = Math.floor(rng() * pool.length);
    const template = pool[idx];

    tasks.push({
      id: `remedy-${today}-${category}`,
      title: template.title,
      description: template.description,
      icon: template.icon,
      points: randInt(rng, 3, 10),
      completed: false,
      isRemedy: true, // flag to distinguish from static tasks
      category,
    });

    usedCategories.add(category);
  }

  // If we somehow have fewer than 4, pad from general
  const generalPool = TASK_POOL.general;
  let gIdx = 0;
  while (tasks.length < 4 && gIdx < generalPool.length) {
    const cat = `general_${gIdx}`;
    if (!usedCategories.has(cat)) {
      const template = generalPool[gIdx];
      tasks.push({
        id: `remedy-${today}-general-${gIdx}`,
        title: template.title,
        description: template.description,
        icon: template.icon,
        points: randInt(rng, 3, 10),
        completed: false,
        isRemedy: true,
        category: "general",
      });
      usedCategories.add(cat);
    }
    gIdx++;
  }

  return tasks;
}
