import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Components/ui/button";
import { Label } from "../Components/ui/label";
import { Slider } from "../Components/ui/slider";
import { Textarea } from "../Components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../Components/ui/card";
import { Checkbox } from "../Components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Components/ui/select";
import { saveDailyCheckIn, getTodaysCheckIn, addPoints } from "../lib/storage";
import {
  Heart,
  Sparkles,
  Moon,
  Brain,
  Droplet,
  Dumbbell,
  Activity,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useMe } from "../hooks/use-auth";
import { useCreateDailyCheckIn } from "../hooks/use-daily-check-in";

const symptoms = [
  "NONE",
  "FEVER",
  "HEADACHE",
  "FATIGUE",
  "COUGH",
  "CHEST_PAIN",
  "DIZZINESS",
  "BODY_ACHES",
];

const symptomLabels = {
  NONE: "None",
  FEVER: "Fever",
  HEADACHE: "Headache",
  FATIGUE: "Fatigue",
  COUGH: "Cough",
  CHEST_PAIN: "Chest Pain",
  DIZZINESS: "Dizziness",
  BODY_ACHES: "Body Aches",
};

// Quick resilience calculation
function calculateQuickScore(data) {
  let score = 100;
  if (data.hoursSlept < 6) score -= 15;
  if (data.stressLevel >= 8) score -= 15;
  if (data.mood <= 4) score -= 10;
  if (data.physicalActivity === 0) score -= 10;
  if (data.waterIntake < 4) score -= 10;
  if (data.symptoms.length > 1 && !data.symptoms.includes("None")) score -= 15;
  return Math.max(0, score);
}

export function DailyCheckIn() {
  const { data: user } = useMe();
  console.log(user);

  const navigate = useNavigate();
  const checkInMutation = useCreateDailyCheckIn();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInData, setCheckInData] = useState({
    hoursSlept: 7,
    stressLevel: 5,
    mood: 7,
    physicalActivity: 0,
    waterIntake: 6,
    symptoms: ["NONE"],
    drinkAlcohol: false,
    smokedToday: false,
    journal: "",
    healthStatus: "GOOD",
  });

  useEffect(() => {
    const todayCheckIn = getTodaysCheckIn();
    if (user?.hasCompletedDailyChecks === true) {
      toast.info("You've already checked in today! 💚");
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    const today = new Date().toISOString().split("T")[0];
    const resilienceScore = calculateQuickScore(checkInData);

    try {
      // 1. Prepare payload for backend
      const symptomsToday = checkInData.symptoms.filter((s) => s !== "NONE");
      const lifestyleChecks = [];
      if (checkInData.drinkAlcohol) lifestyleChecks.push("DRANK_LAST_NIGHT");
      if (checkInData.smokedToday) lifestyleChecks.push("SMOKED_TODAY");

      const payload = {
        hoursSlept: checkInData.hoursSlept,
        stressLevel: checkInData.stressLevel,
        currentMood: checkInData.mood,
        dailyActivityMeasure: checkInData.physicalActivity,
        numOfWaterGlasses: checkInData.waterIntake,
        currentHealthStatus: checkInData.healthStatus.toUpperCase(),
        symptomsToday,
        lifestyleChecks,
        anythingElse: checkInData.journal,
      };

      // 2. Submit to backend
      await checkInMutation.mutateAsync(payload);

      // 3. Local persistence for offline/legacy support
      const checkInLocal = {
        id: `checkin-${Date.now()}`,
        date: today,
        ...checkInData,
        resilienceScore,
      };

      saveDailyCheckIn(checkInLocal);
      addPoints(15);

      toast.success("Check-in complete! You earned 15 points! 🎉");
      navigate("/dashboard");
    } catch (error) {
      console.error("Check-in submission failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to sync check-in with server.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSymptom = (symptom) => {
    setCheckInData((prev) => {
      let newSymptoms = [...prev.symptoms];
      if (symptom === "NONE") {
        newSymptoms = ["NONE"];
      } else {
        newSymptoms = newSymptoms.filter((s) => s !== "NONE");
        if (newSymptoms.includes(symptom)) {
          newSymptoms = newSymptoms.filter((s) => s !== symptom);
        } else {
          newSymptoms.push(symptom);
        }
        if (newSymptoms.length === 0) {
          newSymptoms = ["NONE"];
        }
      }
      return { ...prev, symptoms: newSymptoms };
    });
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center p-4 md:p-8 pb-32">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-100/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-50/20 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
              Daily Vitals Protocol
            </span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Step {step} of 4
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }}
              className="h-full bg-emerald-600 shadow-[0_0_10px_rgba(5,150,105,0.3)] transition-all duration-500"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="text-center pt-10 pb-2">
                <div className="flex justify-center mb-4">
                  <div className="bg-emerald-50 w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-sm">
                    <Heart className="w-10 h-10 text-emerald-600 fill-emerald-600" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">
                  Daily Check-In
                </CardTitle>
                <CardDescription className="text-base font-medium text-gray-400">
                  Just between me and you. No judgment, just tracking. 💚
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8 md:p-12">
                {/* Step 1: Sleep & Energy */}
                {step === 1 && (
                  <div className="space-y-10">
                    <div className="text-center">
                      <div className="inline-block bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                        1 of 4 • Sleep & Energy
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Moon className="w-5 h-5 text-emerald-600" />
                            <Label className="text-sm font-black text-gray-400 uppercase tracking-widest">
                              How many hours did you sleep last night?
                            </Label>
                          </div>
                          <span className="text-2xl font-black text-emerald-600">
                            {checkInData.hoursSlept}h
                          </span>
                        </div>
                        <Slider
                          value={[checkInData.hoursSlept]}
                          onValueChange={([value]) =>
                            setCheckInData({
                              ...checkInData,
                              hoursSlept: value,
                            })
                          }
                          min={0}
                          max={12}
                          step={0.5}
                          className="py-4"
                        />
                        {checkInData.hoursSlept < 6 && (
                          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-center gap-3">
                            <span className="text-lg">😴</span>
                            <p className="text-xs font-bold text-orange-700 leading-tight">
                              That's low, boss. Your body needs rest to stay
                              sharp.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-emerald-600" />
                            <Label className="text-sm font-black text-gray-400 uppercase tracking-widest">
                              How's your stress level today?
                            </Label>
                          </div>
                          <span className="text-2xl font-black text-emerald-600">
                            {checkInData.stressLevel}/10
                          </span>
                        </div>
                        <Slider
                          value={[checkInData.stressLevel]}
                          onValueChange={([value]) =>
                            setCheckInData({
                              ...checkInData,
                              stressLevel: value,
                            })
                          }
                          min={1}
                          max={10}
                          step={1}
                          className="py-4"
                        />
                        <div className="flex justify-between text-[10px] font-black text-gray-300 uppercase tracking-widest px-1">
                          <span>Calm</span>
                          <span>Overwhelmed</span>
                        </div>
                        {checkInData.stressLevel >= 8 && (
                          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-center gap-3">
                            <span className="text-lg">🫂</span>
                            <p className="text-xs font-bold text-orange-700 leading-tight">
                              Omo, take it easy. High stress kills slowly.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            <Label className="text-sm font-black text-gray-400 uppercase tracking-widest">
                              How's your mood right now?
                            </Label>
                          </div>
                          <span className="text-2xl font-black text-yellow-600">
                            {checkInData.mood}/10
                          </span>
                        </div>
                        <Slider
                          value={[checkInData.mood]}
                          onValueChange={([value]) =>
                            setCheckInData({ ...checkInData, mood: value })
                          }
                          min={1}
                          max={10}
                          step={1}
                          className="py-4"
                        />
                        <div className="flex justify-between text-[10px] font-black text-gray-300 uppercase tracking-widest px-1">
                          <span>Low</span>
                          <span>Great</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleNext}
                      className="w-full h-16 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-lg transition-all active:scale-95 shadow-xl"
                    >
                      Next Step <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                )}

                {/* Step 2: Activity & Hydration */}
                {step === 2 && (
                  <div className="space-y-10">
                    <div className="text-center">
                      <div className="inline-block bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                        2 of 4 • Movement & Water
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-emerald-600" />
                            <Label className="text-sm font-black text-gray-400 uppercase tracking-widest">
                              Did you move your body today?
                            </Label>
                          </div>
                          <span className="text-2xl font-black text-emerald-600">
                            {checkInData.physicalActivity}m
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Walking, gym, dancing, anything counts!
                        </p>
                        <Slider
                          value={[checkInData.physicalActivity]}
                          onValueChange={([value]) =>
                            setCheckInData({
                              ...checkInData,
                              physicalActivity: value,
                            })
                          }
                          min={0}
                          max={120}
                          step={5}
                          className="py-4"
                        />
                        {checkInData.physicalActivity === 0 && (
                          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-center gap-3">
                            <span className="text-lg">🏃‍♂️</span>
                            <p className="text-xs font-bold text-orange-700 leading-tight">
                              Your body needs movement. Even 10 mins counts!
                            </p>
                          </div>
                        )}
                        {checkInData.physicalActivity >= 30 && (
                          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
                            <span className="text-lg">💪</span>
                            <p className="text-xs font-bold text-emerald-700 leading-tight">
                              Nice! You're putting in the work.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Droplet className="w-5 h-5 text-blue-600" />
                            <Label className="text-sm font-black text-gray-400 uppercase tracking-widest">
                              How many glasses of water today?
                            </Label>
                          </div>
                          <span className="text-2xl font-black text-blue-600">
                            {checkInData.waterIntake}
                          </span>
                        </div>
                        <Slider
                          value={[checkInData.waterIntake]}
                          onValueChange={([value]) =>
                            setCheckInData({
                              ...checkInData,
                              waterIntake: value,
                            })
                          }
                          min={0}
                          max={12}
                          step={1}
                          className="py-4"
                        />
                        {checkInData.waterIntake < 4 && (
                          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-center gap-3">
                            <span className="text-lg">💧</span>
                            <p className="text-xs font-bold text-orange-700 leading-tight">
                              Drink more water, bro. Lagos heat is not joking.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => setStep(1)}
                        variant="outline"
                        className="flex-1 h-16 rounded-2xl border-2 font-bold hover:bg-gray-50 uppercase tracking-widest text-xs"
                      >
                        <ChevronLeft className="mr-2 w-4 h-4" /> Back
                      </Button>
                      <Button
                        onClick={handleNext}
                        className="flex-[2] h-16 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-lg transition-all active:scale-95 shadow-xl"
                      >
                        Next <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Health Status & Symptoms */}
                {step === 3 && (
                  <div className="space-y-10">
                    <div className="text-center">
                      <div className="inline-block bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                        3 of 4 • Health Status
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-4">
                        <Label className="text-xs font-black uppercase text-gray-400 tracking-widest">
                          How would you describe your current health status?
                        </Label>
                        <Select
                          value={checkInData.healthStatus}
                          onValueChange={(value) =>
                            setCheckInData({
                              ...checkInData,
                              healthStatus: value,
                            })
                          }
                        >
                          <SelectTrigger className="h-14 rounded-xl border-2 font-bold focus:ring-emerald-500">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-2xl">
                            <SelectItem value="EXCELLENT">
                              Excellent - Feeling great!
                            </SelectItem>
                            <SelectItem value="GOOD">
                              Good - Normal, no issues
                            </SelectItem>
                            <SelectItem value="FAIR">
                              Fair - Some minor concerns
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-emerald-600" />
                          <Label className="text-xs font-black uppercase text-gray-900 tracking-widest">
                            Any symptoms today?
                          </Label>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Select all that apply. If nothing, just tick "None"
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {symptoms.map((symptom) => (
                            <div
                              key={symptom}
                              onClick={() => toggleSymptom(symptom)}
                              className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                                checkInData.symptoms.includes(symptom)
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                                  : "bg-white border-gray-100 text-gray-500 hover:border-emerald-100"
                              }`}
                            >
                              <Checkbox
                                id={symptom}
                                checked={checkInData.symptoms.includes(symptom)}
                                onCheckedChange={() => toggleSymptom(symptom)}
                                className="w-5 h-5 border-2"
                              />
                              <Label
                                htmlFor={symptom}
                                className="cursor-pointer font-bold text-sm"
                              >
                                {symptomLabels[symptom]}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => setStep(2)}
                        variant="outline"
                        className="flex-1 h-16 rounded-2xl border-2 font-bold hover:bg-gray-50 uppercase tracking-widest text-xs"
                      >
                        <ChevronLeft className="mr-2 w-4 h-4" /> Back
                      </Button>
                      <Button
                        onClick={handleNext}
                        className="flex-[2] h-16 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-lg transition-all active:scale-95 shadow-xl"
                      >
                        Next <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Lifestyle & Journal */}
                {step === 4 && (
                  <div className="space-y-10">
                    <div className="text-center">
                      <div className="inline-block bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                        4 of 4 • Final Questions
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="p-6 bg-gray-50 rounded-3xl space-y-4 border border-gray-100">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                          Quick lifestyle checks (optional)
                        </span>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id="alcohol"
                              checked={checkInData.drinkAlcohol}
                              onCheckedChange={(checked) =>
                                setCheckInData({
                                  ...checkInData,
                                  drinkAlcohol: checked,
                                })
                              }
                              className="w-6 h-6 rounded-lg"
                            />
                            <Label
                              htmlFor="alcohol"
                              className="cursor-pointer text-sm font-bold text-gray-600"
                            >
                              Had a drink last night? 🥂 (No judgment!)
                            </Label>
                          </div>
                          <div className="flex items-center gap-3">
                            <Checkbox
                              id="smoke"
                              checked={checkInData.smokedToday}
                              onCheckedChange={(checked) =>
                                setCheckInData({
                                  ...checkInData,
                                  smokedToday: checked,
                                })
                              }
                              className="w-6 h-6 rounded-lg"
                            />
                            <Label
                              htmlFor="smoke"
                              className="cursor-pointer text-sm font-bold text-gray-600"
                            >
                              Did you smoke today? 🚬 (Just tracking!)
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label
                          htmlFor="journal"
                          className="text-xs font-black uppercase text-gray-400 tracking-widest"
                        >
                          Anything else on your mind?
                        </Label>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Optional. Write down how you're feeling. This stays
                          private.
                        </p>
                        <Textarea
                          id="journal"
                          placeholder="E.g., Had a long day in traffic... feeling tired but okay."
                          className="rounded-2xl border-2 p-4 font-medium min-h-[140px]"
                          value={checkInData.journal}
                          onChange={(e) =>
                            setCheckInData({
                              ...checkInData,
                              journal: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-tight">
                          <CheckCircle2 className="w-4 h-4" /> Secure &
                          Encrypted
                        </div>
                        <p className="text-[10px] text-emerald-700/80 font-medium">
                          Everything you share is encrypted and private. We
                          never share your data.
                        </p>
                        <div className="mt-1 inline-flex items-center gap-2 bg-white/50 w-fit px-3 py-1 rounded-full text-[10px] font-black text-emerald-700 uppercase">
                          +15 points bonus 🎉
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => setStep(3)}
                        variant="outline"
                        className="flex-1 h-16 rounded-2xl border-2 font-bold hover:bg-gray-50 uppercase tracking-widest text-xs"
                      >
                        <ChevronLeft className="mr-2 w-4 h-4" /> Back
                      </Button>
                      <Button
                        onClick={handleComplete}
                        disabled={isSubmitting}
                        className="flex-[2] h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg transition-all active:scale-95 shadow-xl shadow-emerald-100 uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>Submit ✨</>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2 mt-8 opacity-50">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Privacy Multi-Factor Enabled
          </span>
        </div>
      </div>
    </div>
  );
}
