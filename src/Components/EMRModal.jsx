import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  CheckCircle2,
  Building2,
  ExternalLink,
  Sparkles,
  LogIn,
} from "lucide-react";

const EMR_PROVIDERS = [
  {
    id: "helium",
    name: "Helium Health",
    color: "#10b981",
    desc: "Leading Electronic Medical Records",
  },
  {
    id: "heala",
    name: "Heala",
    color: "#3b82f6",
    desc: "Digital Health Ecosystem",
  },
  {
    id: "axa",
    name: "AXA Mansard",
    color: "#e11d48",
    desc: "Hospital Network Integration",
  },
];

export const EMRModal = ({ isOpen, onClose, onConnect }) => {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(null);

  if (!isOpen) return null;

  const handleSelect = (provider) => {
    setSelected(provider);
    setStep(2);
  };

  const handleFinish = () => {
    setStep(3);
    setTimeout(() => {
      onConnect(selected);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-110 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white w-full max-w-md rounded-4xl p-8 shadow-2xl overflow-hidden"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                Hospital EMR Sync
              </h2>
              <p className="text-gray-500 font-medium mt-2">
                Connect your clinic record via HL7 FHIR
              </p>
            </div>

            <div className="space-y-4">
              {EMR_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleSelect(provider)}
                  className="w-full flex items-center gap-4 p-5 rounded-3xl border-2 border-gray-100 hover:border-emerald-500 transition-all hover:bg-emerald-50/30 group"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                    style={{ background: provider.color }}
                  >
                    <LogIn className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900">{provider.name}</p>
                    <p className="text-xs font-medium text-gray-500">
                      {provider.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
            >
              Maybe Later
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white w-full max-w-md rounded-4xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-6 text-emerald-600">
              <Shield className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Secure OAuth Session
              </span>
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Login to {selected.name}
            </h3>
            <p className="text-gray-500 font-medium mb-6">
              Permission to sync your longitudinal health drift alerts with your
              doctor.
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Clinic Portal ID
                </p>
                <div className="h-2 w-2/3 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Password
                </p>
                <div className="h-2 w-1/2 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-5 bg-gray-900 text-white rounded-3xl font-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              Verify & Authorize
              <ExternalLink className="w-5 h-5 font-black" />
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-4xl p-12 shadow-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12" />
            </motion.div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              Ecosystem Linked!
            </h3>
            <p className="text-gray-500 font-medium">
              Your health drift is now syncing live with {selected.name} EMR
              system.
            </p>

            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">
                  FHIR Active
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
