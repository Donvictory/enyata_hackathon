import React from "react";
import {
  FileText,
  User,
  Activity,
  Clipboard,
  Stethoscope,
  ArrowRight,
  Download,
  Calendar,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

export const DoctorReport = ({ data, onClose }) => {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-4xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-gray-100"
      >
        {/* Header - Clinical Look */}
        <div className="bg-emerald-900 p-8 text-white rounded-t-[2.5rem] sticky top-0 z-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              <Stethoscope className="w-8 h-8 text-emerald-400" />
              Clinical Health Summary
            </h2>
            <p className="text-emerald-200/70 text-sm font-medium mt-1 uppercase tracking-widest">
              Standardized SBAR Protocol Report
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-10 space-y-8" id="sbar-content">
          {/* Metadata Section */}
          <div className="grid grid-cols-2 gap-4 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                  Date of Report
                </p>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  {new Date().toLocaleDateString("en-NG", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                  Record Type
                </p>
                <p className="text-sm font-bold text-gray-900 mt-1">
                  SBAR Framework 1.0
                </p>
              </div>
            </div>
          </div>

          {/* SBAR Sections */}
          <div className="space-y-6">
            {/* Situation */}
            <div className="group">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <span className="text-xs font-black text-blue-700">S</span>
                </div>
                <h3 className="font-black text-gray-500 uppercase tracking-widest text-xs">
                  Situation
                </h3>
              </div>
              <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 text-gray-800 font-bold leading-relaxed">
                {data.situation}
              </div>
            </div>

            {/* Background */}
            <div className="group">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-purple-100 p-1.5 rounded-lg">
                  <span className="text-xs font-black text-purple-700">B</span>
                </div>
                <h3 className="font-black text-gray-500 uppercase tracking-widest text-xs">
                  Background
                </h3>
              </div>
              <div className="bg-purple-50/50 p-6 rounded-3xl border border-purple-100 text-gray-800 font-bold leading-relaxed">
                {data.background}
              </div>
            </div>

            {/* Assessment */}
            <div className="group">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-orange-100 p-1.5 rounded-lg">
                  <span className="text-xs font-black text-orange-700">A</span>
                </div>
                <h3 className="font-black text-gray-500 uppercase tracking-widest text-xs">
                  Assessment
                </h3>
              </div>
              <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 text-gray-800 font-bold leading-relaxed">
                {data.assessment}
              </div>
            </div>

            {/* Recommendation */}
            <div className="group">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-emerald-100 p-1.5 rounded-lg">
                  <span className="text-xs font-black text-emerald-700">R</span>
                </div>
                <h3 className="font-black text-gray-500 uppercase tracking-widest text-xs">
                  Recommendation
                </h3>
              </div>
              <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 text-emerald-900 font-black leading-relaxed">
                {data.recommendation}
              </div>
            </div>
          </div>

          {/* Footer - Interoperability Badge */}
          <div className="pt-8 flex items-center justify-between border-t border-dashed border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                FHIR Compliant Output
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
