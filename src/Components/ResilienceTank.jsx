// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const getStatus = (score) => {
  if (score >= 75)
    return {
      color: "#10b981",
      gradient: "from-emerald-400 to-emerald-600",
      bgColor: "#ecfdf5",
      borderColor: "#a7f3d0",
      label: "Strong",
      emoji: "💪",
    };
  if (score >= 60)
    return {
      color: "#f59e0b",
      gradient: "from-amber-400 to-amber-600",
      bgColor: "#fffbeb",
      borderColor: "#fde68a",
      label: "Moderate",
      emoji: "⚡",
    };
  if (score >= 40)
    return {
      color: "#f97316",
      gradient: "from-orange-400 to-orange-600",
      bgColor: "#fff7ed",
      borderColor: "#fed7aa",
      label: "Low",
      emoji: "📉",
    };
  return {
    color: "#ef4444",
    gradient: "from-red-400 to-red-600",
    bgColor: "#fef2f2",
    borderColor: "#fecaca",
    label: "Depleted",
    emoji: "🔋",
  };
};

export function ResilienceTank({ score }) {
  const safeScore = Math.max(0, Math.min(100, score || 0));
  const status = getStatus(safeScore);
  const fillPercent = safeScore;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Tank */}
      <div
        className="relative w-28 h-44 rounded-xl overflow-hidden"
        style={{
          border: `2px solid ${status.color}22`,
          background: "#f8fafc",
        }}
      >
        {/* Fill */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${fillPercent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 rounded-b-lg"
          style={{
            background: `linear-gradient(to top, ${status.color}, ${status.color}88)`,
          }}
        />

        {/* Subtle wave on top of fill */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-0 right-0 h-2 rounded-full"
          style={{
            bottom: `calc(${fillPercent}% - 4px)`,
            background: `linear-gradient(to bottom, ${status.color}cc, transparent)`,
            filter: "blur(1px)",
            opacity: fillPercent > 5 ? 1 : 0,
          }}
        />

        {/* Scale lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-3 pointer-events-none">
          {[100, 75, 50, 25, 0].map((mark) => (
            <div key={mark} className="flex items-center px-1.5">
              <div className="h-px w-2.5 bg-gray-300/60 rounded" />
              <span className="text-[8px] text-gray-400 ml-1">{mark}</span>
            </div>
          ))}
        </div>

        {/* Center score */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold drop-shadow-sm"
            style={{
              color: fillPercent > 55 ? "white" : status.color,
            }}
          >
            {safeScore}%
          </motion.span>
        </div>
      </div>

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-3 flex flex-col items-center gap-1"
      >
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: status.bgColor,
            color: status.color,
            border: `1px solid ${status.borderColor}`,
          }}
        >
          <span>{status.emoji}</span>
          <span>{status.label}</span>
        </div>
        <p className="text-xs text-gray-500">Resilience</p>
      </motion.div>
    </div>
  );
}
