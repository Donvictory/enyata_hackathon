// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const LEVELS = {
  none: {
    color: "#64748b",
    bgColor: "#f8fafc",
    borderColor: "#e2e8f0",
    label: "No Data",
    emoji: "📋",
    description: "Start your first check-in",
    percent: 0,
  },
  optimal: {
    color: "#10b981",
    bgColor: "#ecfdf5",
    borderColor: "#a7f3d0",
    label: "Optimal",
    emoji: "✅",
    description: "Health patterns are stable",
    percent: 15,
  },
  watch: {
    color: "#f59e0b",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
    label: "Watch",
    emoji: "👀",
    description: "Minor shifts detected",
    percent: 40,
  },
  concern: {
    color: "#f97316",
    bgColor: "#fff7ed",
    borderColor: "#fed7aa",
    label: "Concern",
    emoji: "⚠️",
    description: "Review your habits",
    percent: 65,
  },
  critical: {
    color: "#ef4444",
    bgColor: "#fef2f2",
    borderColor: "#fecaca",
    label: "Critical",
    emoji: "🚨",
    description: "Take action now",
    percent: 90,
  },
};

export function DriftGauge({ level, driftLevel }) {
  const key = level || driftLevel || "optimal";
  const current = LEVELS[key] || LEVELS.optimal;

  // Arc gauge SVG math
  const cx = 100;
  const cy = 95;
  const r = 72;

  const describeArc = (startDeg, endDeg) => {
    const startRad = (Math.PI * (180 - startDeg)) / 180;
    const endRad = (Math.PI * (180 - endDeg)) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy - r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy - r * Math.sin(endRad);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 0 ${x2} ${y2}`;
  };

  // Needle endpoint from percent (0 = left, 100 = right)
  const needleAngle = (current.percent / 100) * Math.PI;
  const needleLen = r * 0.82;
  const needleX = cx - needleLen * Math.cos(needleAngle);
  const needleY = cy - needleLen * Math.sin(needleAngle);

  const segments = [
    { start: 0, end: 45, color: "#10b981", key: "optimal" },
    { start: 45, end: 90, color: "#f59e0b", key: "watch" },
    { start: 90, end: 135, color: "#f97316", key: "concern" },
    { start: 135, end: 180, color: "#ef4444", key: "critical" },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      {/* Arc gauge */}
      <div className="relative w-52 h-28">
        <svg viewBox="0 0 200 105" className="w-full h-full">
          {/* Track background */}
          <path
            d={describeArc(0, 180)}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Colored segments */}
          {segments.map((seg) => (
            <path
              key={seg.key}
              d={describeArc(seg.start, seg.end)}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeLinecap="round"
              opacity={key === seg.key ? 1 : 0.2}
            />
          ))}

          {/* Center pivot */}
          <circle
            cx={cx}
            cy={cy}
            r="5"
            fill="white"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />

          {/* Needle line */}
          <motion.line
            initial={false}
            animate={{ x2: needleX, y2: needleY }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke={current.color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Needle tip */}
          <motion.circle
            initial={false}
            animate={{ cx: needleX, cy: needleY }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            r="3.5"
            fill={current.color}
          />

          {/* Zone labels */}
          <text x="22" y="102" fontSize="7" fill="#94a3b8" textAnchor="start">
            Good
          </text>
          <text x="178" y="102" fontSize="7" fill="#94a3b8" textAnchor="end">
            Risk
          </text>
        </svg>
      </div>

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-2 flex flex-col items-center gap-1.5"
      >
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: current.bgColor,
            color: current.color,
            border: `1px solid ${current.borderColor}`,
          }}
        >
          <span>{current.emoji}</span>
          <span>{current.label}</span>
        </div>
        <p className="text-xs text-gray-500 text-center">
          {current.description}
        </p>
      </motion.div>
    </div>
  );
}
