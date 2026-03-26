import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { Button } from "../Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Components/ui/select";
import { Checkbox } from "../Components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../Components/ui/card";
import { saveUserProfile, calculateBMI, getUserAuth } from "../lib/storage";
import { useOnboard, useMe } from "../hooks/use-auth";
import {
  Heart,
  Sparkles,
  User,
  MapPin,
  Activity,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const nigerianStates = [
  "Lagos",
  "Abuja",
  "Kano",
  "Rivers",
  "Oyo",
  "Kaduna",
  "Ogun",
  "Anambra",
  "Delta",
  "Edo",
  "Enugu",
  "Imo",
  "Kwara",
  "Ondo",
  "Osun",
  "Plateau",
  "Bayelsa",
  "Cross River",
];

const commonConditions = [
  "None",
  "Hypertension",
  "Diabetes",
  "Asthma",
  "Heart Disease",
  "Malaria (Recurring)",
  "Sickle Cell",
];

const familyHistoryOptions = [
  "None",
  "Hypertension",
  "Diabetes",
  "Heart Disease",
  "Stroke",
  "Cancer",
  "Sickle Cell",
];

export function Onboarding() {
  const navigate = useNavigate();
  const onboardMutation = useOnboard();
  const { data: user, isLoading: userLoading } = useMe();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    city: "",
    state: "",
    phone: "",
    knownConditions: [],
    familyHistory: [],
  });

  useEffect(() => {
    if (!userLoading && user && user.isOnboarded) {
      navigate("/dashboard");
    }
  }, [user, userLoading, navigate]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">
            Loading Protocol...
          </p>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (step === 1) {
      if (
        !formData.age ||
        !formData.gender ||
        !formData.height ||
        !formData.weight
      ) {
        toast.error("Please fill in all basic info");
        return;
      }
    }
    if (step === 2) {
      if (!formData.city || !formData.state) {
        toast.error("Please select your location");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleComplete = () => {
    const bmi = calculateBMI(
      parseFloat(formData.weight),
      parseFloat(formData.height),
    );

    // Map frontend labels to backend enums exactly
    const conditionMap = {
      None: "NONE",
      Hypertension: "HYPERTENSION",
      Diabetes: "DIABETES",
      Asthma: "ASTHMA",
      "Heart Disease": "HEART DISEASE",
      "Malaria (Recurring)": "MALARIA",
      "Sickle Cell": "SICKLE CELL",
    };

    const historyMap = {
      None: "NONE",
      Hypertension: "HYPERTENSION",
      Diabetes: "DIABETES",
      "Heart Disease": "HEART DISEASE",
      Stroke: "STROKE",
      Cancer: "CANCER",
      "Sickle Cell": "SICKLE CELL",
    };

    const payload = {
      phoneNumber: formData.phone,
      age: parseInt(formData.age),
      gender: formData.gender.toUpperCase(),
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      city: formData.city,
      state: formData.state,
      healthConditions: formData.knownConditions
        .map((c) => conditionMap[c] || "NONE")
        .filter((c) => c !== "NONE"),
      familyHealthHistory: formData.familyHistory
        .map((h) => historyMap[h] || "NONE")
        .filter((h) => h !== "NONE"),
    };

    onboardMutation.mutate(payload, {
      onSuccess: (response) => {
        const updatedUser = response.data?.user || response.user;
        saveUserProfile({
          ...updatedUser,
          bmi,
        });
        toast.success("Profile synchronized securely! Welcome! 🎉");
        navigate("/check-in");
      },
      onError: (error) => {
        console.error("Sync failed:", error);
        toast.error(
          error.response?.data?.message ||
            "Server synchronization failed, but your data is saved locally.",
        );
        // Fallback save to local storage
        const auth = getUserAuth();
        saveUserProfile({
          ...auth,
          ...payload,
          bmi,
        });
        navigate("/check-in");
      },
    });
  };

  const toggleCondition = (condition) => {
    setFormData((prev) => {
      let newConditions = [...prev.knownConditions];
      if (condition === "None") {
        newConditions = ["None"];
      } else {
        newConditions = newConditions.filter((c) => c !== "None");
        if (newConditions.includes(condition)) {
          newConditions = newConditions.filter((c) => c !== condition);
        } else {
          newConditions.push(condition);
        }
        if (newConditions.length === 0) newConditions = ["None"];
      }
      return { ...prev, knownConditions: newConditions };
    });
  };

  const toggleFamilyHistory = (item) => {
    setFormData((prev) => {
      let newHistory = [...prev.familyHistory];
      if (item === "None") {
        newHistory = ["None"];
      } else {
        newHistory = newHistory.filter((h) => h !== "None");
        if (newHistory.includes(item)) {
          newHistory = newHistory.filter((h) => h !== item);
        } else {
          newHistory.push(item);
        }
        if (newHistory.length === 0) newHistory = ["None"];
      }
      return { ...prev, familyHistory: newHistory };
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
              Onboarding Protocol
            </span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Sequence {step} of 3
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
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
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="bg-emerald-50 w-20 h-20 rounded-4xl flex items-center justify-center shadow-sm">
                      <Heart className="w-10 h-10 text-emerald-600 fill-emerald-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white p-2 rounded-2xl shadow-lg border border-gray-100">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">
                  Welcome to DriftCare NG
                </CardTitle>
                <CardDescription className="text-base font-medium px-6">
                  Your trusted health companion. Let's get to know you a bit.
                </CardDescription>
                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" /> Data Secured & Encrypted
                </div>
              </CardHeader>

              <CardContent className="p-8 md:p-12">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="age"
                          className="text-xs font-black uppercase text-gray-400 tracking-widest"
                        >
                          How old are you?
                        </Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="age"
                            type="number"
                            placeholder="e.g., 28"
                            className="h-14 pl-12 rounded-xl border-2 font-bold focus:ring-emerald-500"
                            value={formData.age}
                            onChange={(e) =>
                              setFormData({ ...formData, age: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="gender"
                          className="text-xs font-black uppercase text-gray-400 tracking-widest"
                        >
                          Gender
                        </Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) =>
                            setFormData({ ...formData, gender: value })
                          }
                        >
                          <SelectTrigger className="h-14 rounded-xl border-2 font-bold focus:ring-emerald-500">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-2xl">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="height"
                            className="text-xs font-black uppercase text-gray-400 tracking-widest"
                          >
                            Height (cm)
                          </Label>
                          <Input
                            id="height"
                            type="number"
                            placeholder="e.g., 170"
                            className="h-14 rounded-xl border-2 font-bold focus:ring-emerald-500"
                            value={formData.height}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                height: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="weight"
                            className="text-xs font-black uppercase text-gray-400 tracking-widest"
                          >
                            Weight (kg)
                          </Label>
                          <Input
                            id="weight"
                            type="number"
                            placeholder="e.g., 75"
                            className="h-14 rounded-xl border-2 font-bold focus:ring-emerald-500"
                            value={formData.weight}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                weight: e.target.value,
                              })
                            }
                          />
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

                {/* Step 2: Location */}
                {step === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="state"
                          className="text-xs font-black uppercase text-gray-400 tracking-widest"
                        >
                          Which state are you in?
                        </Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) =>
                            setFormData({ ...formData, state: value })
                          }
                        >
                          <SelectTrigger className="h-14 rounded-xl border-2 font-bold">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-2xl max-h-[300px]">
                            {nigerianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="city"
                          className="text-xs font-black uppercase text-gray-400 tracking-widest"
                        >
                          City/Town
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="city"
                            placeholder="e.g., Ikeja, Lekki, Wuse"
                            className="h-14 pl-12 rounded-xl border-2 font-bold"
                            value={formData.city}
                            onChange={(e) =>
                              setFormData({ ...formData, city: e.target.value })
                            }
                          />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 pl-1">
                          We use this for local environmental context.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-xs font-black uppercase text-gray-400 tracking-widest"
                        >
                          Phone Number (Optional)
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="e.g., 080 1234 5678"
                          className="h-14 rounded-xl border-2 font-bold"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
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
                        className="flex-2 h-16 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-lg transition-all active:scale-95 shadow-xl"
                      >
                        Next <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Health History */}
                {step === 3 && (
                  <div className="space-y-8">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-emerald-600" />
                          <Label className="text-xs font-black uppercase text-gray-900 tracking-widest">
                            Personal Health Records
                          </Label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {commonConditions.map((condition) => (
                            <div
                              key={condition}
                              onClick={() => toggleCondition(condition)}
                              className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                                formData.knownConditions.includes(condition)
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                                  : "bg-white border-gray-100 text-gray-500 hover:border-emerald-100"
                              }`}
                            >
                              <Checkbox
                                id={condition}
                                checked={formData.knownConditions.includes(
                                  condition,
                                )}
                                onCheckedChange={() =>
                                  toggleCondition(condition)
                                }
                                className="w-5 h-5 border-2"
                              />
                              <Label
                                htmlFor={condition}
                                className="cursor-pointer font-bold text-sm"
                              >
                                {condition}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Stethoscope className="w-5 h-5 text-emerald-600" />
                          <Label className="text-xs font-black uppercase text-gray-900 tracking-widest">
                            Family Genetic History
                          </Label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {familyHistoryOptions.map((item) => (
                            <div
                              key={item}
                              onClick={() => toggleFamilyHistory(item)}
                              className={`p-4 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                                formData.familyHistory.includes(item)
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                                  : "bg-white border-gray-100 text-gray-500 hover:border-emerald-100"
                              }`}
                            >
                              <Checkbox
                                id={`family-${item}`}
                                checked={formData.familyHistory.includes(item)}
                                onCheckedChange={() =>
                                  toggleFamilyHistory(item)
                                }
                                className="w-5 h-5 border-2"
                              />
                              <Label
                                htmlFor={`family-${item}`}
                                className="cursor-pointer font-bold text-sm"
                              >
                                {item}
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
                        onClick={handleComplete}
                        disabled={onboardMutation.isPending}
                        className="flex-2 h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg transition-all active:scale-95 shadow-xl shadow-emerald-100 uppercase tracking-wider"
                      >
                        {onboardMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Securing Data...
                          </>
                        ) : (
                          "Let's Go! 🚀"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <p className="text-[10px] text-center font-bold text-gray-400 uppercase tracking-[0.2em] pt-8">
          By proceeding, you agree to our Medical Data Protocol.
        </p>
      </div>
    </div>
  );
}
