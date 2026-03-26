import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { useRegister } from "../hooks/use-auth";
import { Sparkles, Loader2, User, Mail, Lock, HeartPulse, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function Signup() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    registerMutation.mutate(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => {
          toast.success("Account created successfully! 🎉");
          navigate("/onboarding");
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message ||
              "Registration failed. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Visual Brand Side */}
      <div className="hidden md:flex md:w-[45%] lg:w-[40%] bg-emerald-900 relative flex-col justify-between p-12 text-white overflow-hidden">
        {/* Soft Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-emerald-700/50 blur-[120px] rounded-full point-events-none" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] bg-emerald-500/30 blur-[120px] rounded-full point-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
            <HeartPulse className="w-8 h-8 text-emerald-300" />
          </div>
          <span className="text-2xl font-bold tracking-tight">DriftCare NG</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-sm mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]"
          >
            Start your preventive
            <br />
            <span className="text-emerald-300">journey today.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-emerald-100/80 text-lg font-medium leading-relaxed"
          >
            A secured, intelligent framework to track the subtle lifestyle signals before they turn into symptoms.
          </motion.p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-emerald-200/60 font-medium">
          <ShieldCheck className="w-4 h-4" /> End-to-end Local Encryption
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 bg-white relative">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[440px] mx-auto"
        >
          {/* Mobile Logo Only */}
          <div className="md:hidden flex items-center gap-3 mb-10">
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl shadow-sm border border-emerald-100">
              <HeartPulse className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">DriftCare</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Create Account
            </h2>
            <p className="text-gray-500 font-medium text-base">
              Securely register to start tracking your health.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-900 ml-1">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <Input
                  id="name"
                  type="text"
                  placeholder="E.g. John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="h-14 pl-12 rounded-2xl border-gray-200 bg-gray-50 hover:bg-white focus:bg-white font-medium text-base focus-visible:ring-emerald-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-900 ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="h-14 pl-12 rounded-2xl border-gray-200 bg-gray-50 hover:bg-white focus:bg-white font-medium text-base focus-visible:ring-emerald-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-900 ml-1">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="h-14 pl-12 rounded-2xl border-gray-200 bg-gray-50 hover:bg-white focus:bg-white font-medium text-base focus-visible:ring-emerald-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-900 ml-1">Confirm Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  className="h-14 pl-12 rounded-2xl border-gray-200 bg-gray-50 hover:bg-white focus:bg-white font-medium text-base focus-visible:ring-emerald-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 mt-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-base transition-all active:scale-[0.98] shadow-xl shadow-gray-200"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Secure Account"
              )}
            </Button>

            <div className="text-center font-medium text-gray-500 pt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
              >
                Log in instead
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
