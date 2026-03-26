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
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Components/ui/select";
import { getUserProfile, saveUserProfile, calculateBMI } from "../lib/storage";
import { User, Save, ArrowLeft, Camera, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

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

export function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    sex: "",
    height: "",
    weight: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    const profile = getUserProfile();
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        age: profile.age?.toString() || "",
        sex: profile.sex || "",
        height: profile.height?.toString() || "",
        weight: profile.weight?.toString() || "",
        city: profile.city || "",
        state: profile.state || "",
      });
    }
  }, []);

  const handleSave = () => {
    // Validation
    if (
      !formData.name ||
      !formData.age ||
      !formData.sex ||
      !formData.height ||
      !formData.weight
    ) {
      toast.error("Please fill in all required fields ⚠️");
      return;
    }

    const profile = getUserProfile();
    if (!profile) {
      toast.error("Profile not found");
      return;
    }

    const weightNum = parseFloat(formData.weight);
    const heightNum = parseFloat(formData.height);
    const bmi = calculateBMI(weightNum, heightNum);

    const updatedProfile = {
      ...profile,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      age: parseInt(formData.age),
      sex: formData.sex,
      height: heightNum,
      weight: weightNum,
      bmi: bmi,
      city: formData.city,
      state: formData.state,
    };

    saveUserProfile(updatedProfile);
    toast.success("Profile updated successfully! ✅");
    navigate("/profile");
  };

  return (
    <div className="min-h-screen p-4 pb-24 bg-gray-50/50">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="rounded-2xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
              Privacy Protected
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10"
        >
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-emerald-200 ring-4 ring-white">
              <User className="w-12 h-12 text-white" />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-2xl shadow-lg border border-gray-100 text-emerald-600 hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Edit Profile
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Keep your biological metrics accurate
          </p>
        </motion.div>

        {/* Form Card */}
        <Card className="border-none shadow-2xl shadow-black/5 bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-emerald-50/30 border-b border-gray-50 pb-8 px-8">
            <CardTitle className="text-xl font-bold text-gray-800">
              Biological Parameters
            </CardTitle>
            <CardDescription className="text-gray-500">
              Accurate height and weight ensure precise health analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-xs font-black uppercase tracking-widest text-gray-400"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    className="h-12 rounded-xl border-gray-100 focus:ring-emerald-500 shadow-sm"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs font-black uppercase tracking-widest text-gray-400"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@health.com"
                    className="h-12 rounded-xl border-gray-100 shadow-sm"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-xs font-black uppercase tracking-widest text-gray-400"
                >
                  Phone Number (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="080 1234 5678"
                  className="h-12 rounded-xl border-gray-100 shadow-sm"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="age"
                    className="text-xs font-black uppercase tracking-widest text-gray-400"
                  >
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    className="h-12 rounded-xl border-gray-100 shadow-sm"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="sex"
                    className="text-xs font-black uppercase tracking-widest text-gray-400"
                  >
                    Biological Sex
                  </Label>
                  <Select
                    value={formData.sex}
                    onValueChange={(value) =>
                      setFormData({ ...formData, sex: value })
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-gray-100 shadow-sm">
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                <div className="space-y-2">
                  <Label
                    htmlFor="height"
                    className="text-xs font-black uppercase tracking-widest text-emerald-600"
                  >
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    className="h-12 rounded-xl border-emerald-100 bg-white shadow-sm"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="weight"
                    className="text-xs font-black uppercase tracking-widest text-emerald-600"
                  >
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    className="h-12 rounded-xl border-emerald-100 bg-white shadow-sm"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="state"
                    className="text-xs font-black uppercase tracking-widest text-gray-400"
                  >
                    State of Residence
                  </Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) =>
                      setFormData({ ...formData, state: value })
                    }
                  >
                    <SelectTrigger className="h-12 rounded-xl border-gray-100 shadow-sm">
                      <SelectValue placeholder="Selection State" />
                    </SelectTrigger>
                    <SelectContent>
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
                    className="text-xs font-black uppercase tracking-widest text-gray-400"
                  >
                    City/Town
                  </Label>
                  <Input
                    id="city"
                    placeholder="e.g. Ikeja"
                    className="h-12 rounded-xl border-gray-100 shadow-sm"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <Button
                onClick={() => navigate("/profile")}
                variant="outline"
                className="flex-1 h-14 rounded-2xl border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-[2] h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200 font-black"
              >
                <Save className="w-5 h-5 mr-3" />
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
