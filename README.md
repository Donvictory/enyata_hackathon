# DriftCare NG 🌿

> **Nigeria's First AI-Powered Preventive Health Drift Monitor**

DriftCare NG is a state-of-the-art, behavior-first health intelligence platform Built for the Enyata Hackathon. It focuses on **drift detection**—analyzing your daily lifestyle, stress levels, and biometrics to catch subtle shifts in your health baseline before they develop into serious clinical conditions (like Hypertension, Burnout, or Febrile Illness). 

Rather than diagnosing disease, DriftCare identifies patterns, provides actionable remedies, and generates professional **SBAR medical reports** to share with a physician.

---

## 🌟 Key Features

*   **Longitudinal Drift Detection Engine**
    *   Continuously monitors daily inputs (Sleep, Stress, Physical Activity, Hydration, Mood, Symptoms).
    *   Detects 4 core risk patterns: **Hypertension Risk, Stress & Burnout, Febrile Illness (Malaria/Typhoid pattern), and Diabetes Risk**.
*   **Daily Check-in Protocol & Health Tasks**
    *   Encrypted, gamified vitals tracking interface.
    *   Dynamically seeds personalized **Remedy Tasks** based on the exact biometrics of that day to steer your health back to baseline.
*   **Biological Resilience Tank**
    *   Visual "Health XP" tracking your systemic capacity to adapt to stress.
*   **Clinical EMR Ecosystem & SBAR Generator**
    *   Mocks FHIR-compliant connections to EHR systems (like Helium Health).
    *   Exports a strictly formatted **Doctor-Ready SBAR Report** (Situation, Background, Assessment, Recommendation) so physicians get clinical summaries rather than arbitrary data.
*   **AI Health Companion (Local Mock)**
    *   A simulated intelligent context companion tailored to the user’s real-time risk profile and history.
*   **PWA & Push Notification Ready**
    *   Configured with Vite PWA to be fully installable.
    *   Browser-native push notification integrations to alert users of urgent drift findings.

---

## 🛠 Tech Stack & Architecture

This application operates as a Progressive Web Application leveraging heavily cached offline-first experiences. **All backend interactions have been gracefully mocked to run strictly in the browser using LocalStorage.**

*   **Framework:** React 18 + Vite
*   **Routing:** React Router DOM (v6)
*   **Styling:** Tailwind CSS v4 (+ UI components heavily softened with humanistic *DM Sans* typography)
*   **State & Caching:** TanStack React Query (`v5`)
*   **Data Visualization:** Recharts
*   **Animation Engine:** Framer Motion
*   **Icons:** Lucide React

---

## 🚀 Getting Started

Since the application has been refactored to run locally entirely on the browser (no backend required for the prototype), getting started is incredibly simple:

### Prerequisites
*   [Node.js](https://nodejs.org/en/) (v18+)

### Installation

1. Clone the repository and navigate into the project root:
   ```bash
   cd enyata_hackathon
   ```
2. Install the necessary frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local server URL (usually `http://localhost:5173`).

---

## 📱 Working With The Prototype

1. **Sign Up / Login:** You can enter any mock credentials. The app uses pseudo-auth to assign you a unique profile.
2. **Onboarding:** Input your age, height, weight, conditions, and generic history. This shapes the baseline bounds for your health.
3. **Daily Check-In:** Answer the 4-step protocol today. Because data is stored locally, you cannot check in twice on the same day.
4. **Dashboard:** 
   * View the *Resilience Tank* and *Drift Gauge*.
   * Tick off your dynamically generated remedy habits to earn points.
   * Hit the **"Generate Summary"** button to export an SBAR report.

---

## 🔒 Medical Disclaimer

**DriftCare NG detects behavioral drift—not disease.** It is a risk intelligence layer, not a diagnostic tool.

Always consult a licensed healthcare professional for medical diagnoses. This platform encourages early consultation. It does NOT diagnose, prescribe, or replace doctors under any circumstances.
