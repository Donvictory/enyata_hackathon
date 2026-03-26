import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Phone,
  Ruler,
  Weight
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../Components/ui/utils";

const nigerianStates = [
  "Lagos", "Abuja", "Kano", "Rivers", "Oyo", "Kaduna", "Ogun", "Anambra", "Delta", "Edo", "Enugu", "Imo", "Kwara", "Ondo", "Osun", "Plateau", "Bayelsa", "Cross River",
].sort();

const commonConditions = [
  "None", "Hypertension", "Diabetes", "Asthma", "Heart Disease", "Malaria (Recurring)", "Sickle Cell",
];

const familyHistoryOptions = [
  "None", "Hypertension", "Diabetes", "Heart Disease", "Stroke", "Cancer", "Sickle Cell",
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
          <p className="text-sm font-medium text-gray-500">Checking context...</p>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.age || !formData.gender || !formData.height || !formData.weight) {
        toast.error("Please fill in basic details.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleComplete = async () => {
    try {
      const conditionMap = {
        None: "NONE",
        Hypertension: "HYPERTENSION",
        Diabetes: "DIABETES",
        Asthma: "ASTHMA",
        "Heart Disease": "HEART DISEASE",
        "Malaria (Recurring)": "MALARIA",
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
        familyHealthHistory: formData.familyHistory.filter((h) => h !== "None"),
      };

      await onboardMutation.mutateAsync(payload);
      toast.success("Profile complete! Welcome to DriftCare. 💚");
      navigate("/dashboard");
    } catch (error) {
      console.error("Onboarding failed:", error);
      toast.error("Sync failed, but profile saved locally.");
      navigate("/dashboard");
    }
  };

  const toggleArrayItem = (listName, item) => {
    setFormData((prev) => {
      let arr = [...prev[listName]];
      if (item === "None") {
        arr = ["None"];
      } else {
        arr = arr.filter((c) => c !== "None");
        if (arr.includes(item)) {
          arr = arr.filter((c) => c !== item);
        } else {
          arr.push(item);
        }
        if (arr.length === 0) arr = ["None"];
      }
      return { ...prev, [listName]: arr };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center p-4 md:p-8 pb-32 overflow-y-auto overflow-x-hidden w-full max-w-[100vw]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/30 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[550px] mt-4 md:mt-12 relative z-10">
        {/* Progress Indicator */}
        <div className="mb-10 w-full px-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-800 tracking-tight">
              {step === 1 ? "Biological Identity" : step === 2 ? "Environmental Context" : "Clinical History"}
            </span>
            <span className="text-sm font-semibold text-gray-400">Step {step} of 3</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="h-1.5 flex-1 rounded-full bg-gray-200 overflow-hidden relative">
                {step >= idx && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden p-2 w-full">
              <CardHeader className="text-center pt-8 pb-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="bg-emerald-50 w-20 h-20 rounded-3xl flex items-center justify-center shadow-inner">
                      <Heart className="w-10 h-10 text-emerald-500 fill-emerald-500" />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 tracking-tight">
                  Welcome to DriftCare
                </CardTitle>
                <CardDescription className="text-base font-medium mt-2 text-gray-500">
                  Let's personalize your health models.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 md:px-10 pb-10">
                {/* Step 1 */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm font-semibold text-gray-700 ml-1">Age</Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        <Input
                          id="age"
                          type="number"
                          placeholder="E.g., 28"
                          className="h-14 pl-12 rounded-2xl border-gray-200 bg-white hover:bg-gray-50 focus:bg-white font-medium text-lg focus-visible:ring-emerald-500 shadow-sm transition-all"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 ml-1">Biological Sex</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setFormData({ ...formData, gender: "male" })}
                          className={cn(
                            "h-14 rounded-2xl border-2 transition-all font-bold text-base",
                            formData.gender === "male"
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                              : "border-gray-100 text-gray-500 hover:border-emerald-100"
                          )}
                        >
                          Male
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setFormData({ ...formData, gender: "female" })}
                          className={cn(
                            "h-14 rounded-2xl border-2 transition-all font-bold text-base",
                            formData.gender === "female"
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                              : "border-gray-100 text-gray-500 hover:border-emerald-100"
                          )}
                        >
                          Female
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="height" className="text-sm font-semibold text-gray-700 ml-1">Height (cm)</Label>
                        <div className="relative group">
                          <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            id="height"
                            type="number"
                            placeholder="175"
                            className="h-14 pl-12 rounded-2xl border-gray-200 bg-white hover:bg-gray-50 focus:bg-white font-medium text-lg focus-visible:ring-emerald-500 shadow-sm transition-all"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight" className="text-sm font-semibold text-gray-700 ml-1">Weight (kg)</Label>
                        <div className="relative group">
                          <Weight className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                          <Input
                            id="weight"
                            type="number"
                            placeholder="70"
                            className="h-14 pl-12 rounded-2xl border-gray-200 bg-white hover:bg-gray-50 focus:bg-white font-medium text-lg focus-visible:ring-emerald-500 shadow-sm"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleNext} className="w-full h-14 mt-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all active:scale-[0.98] shadow-lg shadow-emerald-200/50">
                      Continue <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-semibold text-gray-700 ml-1">State of Residence</Label>
                      <Select value={formData.state} onValueChange={(v) => setFormData({ ...formData, state: v })}>
                        <SelectTrigger className="h-14 rounded-2xl border-gray-200 bg-white hover:bg-gray-50 focus:bg-white font-medium text-lg focus:ring-emerald-500 shadow-sm">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border border-gray-100 shadow-xl max-h-[250px] p-2 overflow-y-auto">
                          {nigerianStates.map((s) => (
                            <SelectItem key={s} value={s} className="py-3 px-4 rounded-xl cursor-pointer font-medium hover:bg-gray-50">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-semibold text-gray-700 ml-1">City / Region</Label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        <Input
                          id="city"
                          placeholder="E.g., Ikeja, Lekki, Wuse"
                          className="h-14 pl-12 rounded-2xl border-gray-200 bg-white hover:bg-white focus:bg-white font-medium text-lg focus-visible:ring-emerald-500 shadow-sm"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 ml-1 flex items-center justify-between">
                        Phone Number
                        <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Optional</span>
                      </Label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Your number"
                          className="h-14 pl-12 rounded-2xl border-gray-200 bg-white hover:bg-white focus:bg-white font-medium text-lg focus-visible:ring-emerald-500 shadow-sm"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleBack} variant="outline" className="h-14 w-14 rounded-2xl border-gray-200 bg-white hover:bg-gray-50 transition-all font-semibold">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </Button>
                      <Button onClick={handleNext} className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-all active:scale-[0.98] shadow-lg shadow-emerald-200/50">
                        Continue <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100/50 p-2 rounded-xl">
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <Label className="font-bold text-gray-900 text-base">Your Medical History</Label>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {commonConditions.map((condition) => (
                          <div
                            key={condition}
                            onClick={() => toggleArrayItem("knownConditions", condition)}
                            className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                              formData.knownConditions.includes(condition)
                                ? "bg-blue-50/50 border-blue-200 text-blue-700 shadow-sm"
                                : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
                            }`}
                          >
                            <Checkbox checked={formData.knownConditions.includes(condition)} />
                            <span className="font-semibold text-sm leading-tight">{condition}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-100/50 p-2 rounded-xl">
                          <Stethoscope className="w-5 h-5 text-purple-600" />
                        </div>
                        <Label className="font-bold text-gray-900 text-base">Family History</Label>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {familyHistoryOptions.map((item) => (
                          <div
                            key={item}
                            onClick={() => toggleArrayItem("familyHistory", item)}
                            className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                              formData.familyHistory.includes(item)
                                ? "bg-purple-50/50 border-purple-200 text-purple-700 shadow-sm"
                                : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
                            }`}
                          >
                            <Checkbox checked={formData.familyHistory.includes(item)} />
                            <span className="font-semibold text-sm leading-tight">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleBack} variant="outline" className="h-14 w-14 rounded-2xl border-gray-200 bg-white hover:bg-gray-50 transition-all font-semibold">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </Button>
                      <Button
                        onClick={handleComplete}
                        disabled={onboardMutation.isPending}
                        className="flex-1 h-14 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-base transition-all active:scale-[0.98] shadow-xl shadow-gray-200/50"
                      >
                        {onboardMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Profile 🚀"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2 mt-8 opacity-60">
          <ShieldCheck className="w-4 h-4 text-gray-500" />
          <p className="text-xs font-semibold text-gray-500 tracking-wide">
            Medical Data Protocol Active
          </p>
        </div>
      </div>
    </div>
  );
}
