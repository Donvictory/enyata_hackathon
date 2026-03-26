import { useNavigate } from "react-router-dom";
import { useMe } from "../hooks/use-auth";
import {
  Activity,
  Shield,
  TrendingUp,
  Heart,
  ArrowRight,
  Sparkles,
  Award,
  Smartphone,
  CheckCircle2,
  Lock,
  AlertTriangle,
  FileText,
  Brain,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../Components/ui/button";

export function LandingPage() {
  const navigate = useNavigate();
  const { data: user } = useMe();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/20 shadow-sm rounded-full px-4 md:px-8 py-3">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-xl shadow-lg shadow-emerald-100">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tighter text-gray-900">
              DRIFT<span className="text-emerald-600">CARE</span>{" "}
              <span className="text-xs font-black text-gray-400 tracking-widest">
                NG
              </span>
            </span>
          </div>
          {/* {user ? (
            <>
              <div className="hidden sm:flex items-center gap-6">
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 shadow-lg shadow-emerald-100"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <div className="flex sm:hidden items-center gap-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-xs font-black text-emerald-600 uppercase tracking-widest"
                >
                  Dashboard
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-6">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  Sign In
                </button>
                <Button
                  onClick={() => navigate("/signup")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 shadow-lg shadow-emerald-100"
                >
                  Join DriftCare NG
                </Button>
              </div>
              <div className="flex sm:hidden items-center gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="text-xs font-black text-emerald-600 uppercase tracking-widest"
                >
                  Login
                </button>
              </div>
            </>
          )} */}

          <div className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-bold text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Sign In
            </button>
            <Button
              onClick={() => navigate("/signup")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 shadow-lg shadow-emerald-100"
            >
              Join DriftCare NG
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full mb-6 md:mb-8"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] md:text-xs font-black text-emerald-700 uppercase tracking-widest">
              Nigeria&apos;s AI-Powered Preventive Health Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter mb-6 md:mb-8 leading-[1.1] md:leading-[0.9]"
          >
            Detect Drift. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
              Act Before It&apos;s Late.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 md:mb-12 font-medium leading-relaxed px-2"
          >
            DriftCare NG is an AI-powered preventive health drift monitor built
            for Nigeria. We detect behavioral and symptom drift from your
            personal health baseline — and alert you to consult a doctor{" "}
            <strong>before</strong> conditions become emergencies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-10"
          >
            {[
              "No Wearable Required",
              "Behavior-First",
              "Doctor-Ready Export",
              "Nigerian Disease Context",
            ].map((tag) => (
              <span
                key={tag}
                className="bg-white border border-gray-200 text-gray-600 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0"
          >
            {user ? (
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 md:px-10 py-6 md:py-8 rounded-2xl md:rounded-3xl text-lg md:text-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-200"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/signup")}
                  className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-8 md:px-10 py-6 md:py-8 rounded-2xl md:rounded-3xl text-lg md:text-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-gray-200"
                >
                  Start Monitoring Free
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="w-full sm:w-auto px-8 md:px-10 py-6 md:py-8 rounded-2xl md:rounded-3xl text-lg md:text-xl font-bold bg-white border-2 border-gray-100 hover:bg-gray-50 transition-all hover:scale-105"
                >
                  Sign In
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Problem Statement Banner */}
      <section className="py-10 px-4 md:px-6 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-base md:text-lg font-bold text-gray-300 leading-relaxed">
            <span className="text-emerald-400 font-black">
              The Problem in Nigeria:
            </span>{" "}
            Most people only visit hospitals when symptoms become severe. Silent
            conditions like{" "}
            <span className="text-white font-black">
              Hypertension, Diabetes &amp; Malaria
            </span>{" "}
            go undetected for months. DriftCare changes that with{" "}
            <span className="text-emerald-400 font-black">
              daily behavioral tracking
            </span>
            .
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">
              How DriftCare NG Works
            </h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">
              A behavior-first system. No diagnosis. No wearable. Just daily
              tracking that actually means something.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-emerald-50/50 border border-emerald-100"
            >
              <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl w-fit shadow-sm mb-4 md:mb-6 text-emerald-600">
                <Activity className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 md:mb-4 tracking-tight">
                Daily Check-In
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">
                Log sleep, stress, mood, activity, water & symptoms in under 60
                seconds. Builds your personal health baseline.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-blue-50/50 border border-blue-100"
            >
              <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl w-fit shadow-sm mb-4 md:mb-6 text-blue-600">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 md:mb-4 tracking-tight">
                Drift Detection
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">
                Our AI engine detects 4 Nigerian health risk patterns:
                Hypertension, Febrile Illness, Stress Burnout &amp; Diabetes
                Risk.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-amber-50/50 border border-amber-100"
            >
              <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl w-fit shadow-sm mb-4 md:mb-6 text-amber-600">
                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 md:mb-4 tracking-tight">
                Early Alerts
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">
                Contextual AI alerts encourage you to get tested or consult a
                doctor before conditions escalate. Not panic — just process.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-purple-50/50 border border-purple-100"
            >
              <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl w-fit shadow-sm mb-4 md:mb-6 text-purple-600">
                <FileText className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 md:mb-4 tracking-tight">
                Doctor Export
              </h3>
              <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">
                Export a structured 30-day health summary to share with your
                doctor. Better context means better consultations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter mb-6 md:mb-8 italic">
                &quot;Shift Nigeria from reactive care to preventive care.&quot;
              </h2>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                DriftCare NG acts as a behavioral risk intelligence layer before
                hospital visits. It does NOT diagnose or prescribe — it detects
                patterns and nudges you toward early consultation.
              </p>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-base md:text-lg font-bold text-gray-700">
                    Detects Hypertension, Malaria &amp; Burnout Risk Patterns
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-base md:text-lg font-bold text-gray-700">
                    Doctor-Ready Health Export (30-day summary)
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-base md:text-lg font-bold text-gray-700">
                    Verified Nigerian Doctor Finder
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-base md:text-lg font-bold text-gray-700">
                    Gamified &quot;Health Tank&quot; — not fear-based alerts
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg text-emerald-600 shadow-sm border border-emerald-100">
                    <Lock className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="text-base md:text-lg font-bold text-gray-700 uppercase tracking-widest text-emerald-600">
                    Encrypted &amp; Private
                  </span>
                </div>
              </div>
            </div>
            <div className="relative mt-8 md:mt-0">
              <div className="absolute inset-0 bg-emerald-100 blur-[60px] md:blur-[100px] opacity-30 animate-pulse" />
              <div className="relative bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <div>
                    <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                      Resilience Score
                    </p>
                    <p className="text-3xl md:text-4xl font-black text-emerald-600">
                      88.4
                    </p>
                  </div>
                  <div className="bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                    Optimal
                  </div>
                </div>
                <div className="h-32 md:h-40 w-full bg-emerald-50 rounded-2xl flex items-end p-4 gap-2">
                  {[40, 60, 45, 90, 75, 88, 92].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1 }}
                      className="flex-1 bg-emerald-400 rounded-lg"
                    />
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl">
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
                      Drift Pattern
                    </p>
                    <p className="text-sm font-black text-amber-900 mt-1">
                      Stress + Low Sleep
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl">
                    <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">
                      Recommendation
                    </p>
                    <p className="text-sm font-black text-blue-900 mt-1">
                      Check BP readings
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-emerald-600 rounded-2xl text-white">
                  <p className="text-xs md:text-sm font-bold italic">
                    &quot;Pattern analysis suggests high recovery resilience.
                    Keep up current hydration levels.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Drift Patterns Section */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">
              4 Drift Patterns We Monitor
            </h2>
            <p className="text-gray-400 font-medium max-w-xl mx-auto">
              Built specifically for the Nigerian disease burden.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🩺",
                title: "Hypertension Risk",
                pattern: "High stress + Headache + Poor sleep + Family history",
                action: "→ Encourages BP testing",
                color: "border-red-500/30 bg-red-950/20",
              },
              {
                icon: "🌡️",
                title: "Febrile Illness",
                pattern:
                  "Fever + Fatigue + Reduced activity + Headache (Malaria-like)",
                action: "→ Encourages early malaria testing",
                color: "border-orange-500/30 bg-orange-950/20",
              },
              {
                icon: "🧠",
                title: "Stress & Burnout",
                pattern: "Sustained stress + Mood decline + Reduced sleep",
                action: "→ Warns of cardiovascular & mental health risk",
                color: "border-blue-500/30 bg-blue-950/20",
              },
              {
                icon: "🩸",
                title: "Diabetes Risk",
                pattern: "High BMI + Low activity + Fatigue + Family history",
                action: "→ Encourages blood glucose screening",
                color: "border-purple-500/30 bg-purple-950/20",
              },
            ].map((p) => (
              <div
                key={p.title}
                className={`border rounded-3xl p-6 ${p.color}`}
              >
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="text-lg font-black mb-3">{p.title}</h3>
                <p className="text-sm text-gray-400 font-medium mb-4 leading-relaxed">
                  {p.pattern}
                </p>
                <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                  {p.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-20 px-4 md:px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            <span className="text-xl font-black tracking-tighter text-gray-900">
              DRIFTCARE{" "}
              <span className="text-emerald-600 text-sm tracking-widest">
                NG
              </span>
            </span>
          </div>
          <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-widest text-center">
            © 2026 DriftCare NG · AI-Powered Preventive Health · Built for
            Nigeria.
          </p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            NOT A DIAGNOSTIC TOOL
          </p>
        </div>
      </footer>
    </div>
  );
}
