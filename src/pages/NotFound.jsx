import { useNavigate } from "react-router-dom";
import { Button } from "../Components/ui/button";
import { Home, Compass, Map, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-200 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white/70 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-[3rem] p-12 text-center relative z-10"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              y: [0, -5, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 border-2 border-emerald-50 shadow-inner"
          >
            <Compass className="w-12 h-12" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-8xl font-black text-gray-900 tracking-tighter mb-2">
            4<span className="text-emerald-500">0</span>4
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
            You've drifted off course!
          </h1>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back to your health journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => navigate("/dashboard")}
              size="lg"
              className="w-full sm:w-auto px-8 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-100 font-black text-lg transition-all hover:scale-105"
            >
              <Home className="w-5 h-5 mr-3" />
              Go to Dashboard
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8 h-14 rounded-2xl border-2 border-gray-100 text-gray-600 hover:bg-white shadow-lg font-black text-lg transition-all"
            >
              Go Back
            </Button>
          </div>
        </motion.div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <Map className="w-4 h-4" />
            <span>Health Drift System Fault</span>
          </div>
        </div>
      </motion.div>

      {/* Floating accent icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 opacity-20 hidden md:block"
      >
        <AlertCircle className="w-12 h-12 text-emerald-600" />
      </motion.div>
    </div>
  );
}
