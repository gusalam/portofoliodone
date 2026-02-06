import { motion } from "framer-motion";

const ChristmasOrnaments = () => {
  const colors = ["#FF0000", "#FFD700", "#228B22", "#FFFFFF", "#FF4500"];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Christmas Lights - Top */}
      <div className="absolute top-0 left-0 right-0 h-16">
        <svg className="w-full h-full" viewBox="0 0 1200 60" preserveAspectRatio="none">
          {/* Wire */}
          <path
            d="M0 20 Q100 40 200 20 Q300 40 400 20 Q500 40 600 20 Q700 40 800 20 Q900 40 1000 20 Q1100 40 1200 20"
            stroke="currentColor"
            className="text-foreground/20"
            strokeWidth="2"
            fill="none"
          />
          {/* Bulbs */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.g key={i}>
              <motion.ellipse
                cx={50 + i * 100}
                cy={i % 2 === 0 ? 25 : 35}
                rx="8"
                ry="12"
                fill={colors[i % colors.length]}
                animate={{
                  opacity: [0.6, 1, 0.6],
                  filter: [
                    `drop-shadow(0 0 3px ${colors[i % colors.length]}80)`,
                    `drop-shadow(0 0 10px ${colors[i % colors.length]})`,
                    `drop-shadow(0 0 3px ${colors[i % colors.length]}80)`,
                  ],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <rect
                x={47 + i * 100}
                y={i % 2 === 0 ? 13 : 23}
                width="6"
                height="5"
                fill="currentColor"
                className="text-foreground/30"
              />
            </motion.g>
          ))}
        </svg>
      </div>

      {/* Christmas Tree Silhouette - Bottom Right */}
      <motion.svg
        className="fixed bottom-0 right-5 w-40 h-64 text-green-600/20"
        viewBox="0 0 100 160"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Tree */}
        <polygon points="50,10 20,60 35,60 10,110 30,110 0,160 100,160 70,110 90,110 65,60 80,60" fill="currentColor" />
        {/* Trunk */}
        <rect x="40" y="155" width="20" height="15" fill="#8B4513" opacity="0.4" />
        {/* Star */}
        <motion.path
          d="M50 5 L52 12 L59 12 L53 17 L56 25 L50 20 L44 25 L47 17 L41 12 L48 12 Z"
          fill="#FFD700"
          animate={{
            filter: [
              "drop-shadow(0 0 5px #FFD700)",
              "drop-shadow(0 0 15px #FFD700)",
              "drop-shadow(0 0 5px #FFD700)",
            ],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Ornaments on tree */}
        {[
          { cx: 35, cy: 50, color: "#FF0000" },
          { cx: 60, cy: 55, color: "#FFD700" },
          { cx: 45, cy: 80, color: "#0000FF" },
          { cx: 55, cy: 90, color: "#FF00FF" },
          { cx: 30, cy: 100, color: "#00FF00" },
          { cx: 65, cy: 110, color: "#FF4500" },
          { cx: 40, cy: 130, color: "#FFFF00" },
          { cx: 60, cy: 140, color: "#FF0000" },
        ].map((ornament, i) => (
          <motion.circle
            key={i}
            cx={ornament.cx}
            cy={ornament.cy}
            r="4"
            fill={ornament.color}
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          />
        ))}
      </motion.svg>

      {/* Presents - Bottom Left */}
      <motion.div
        className="fixed bottom-4 left-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <svg width="80" height="60" viewBox="0 0 80 60">
          {/* Present 1 */}
          <rect x="5" y="25" width="30" height="30" fill="#FF0000" opacity="0.3" rx="2" />
          <rect x="18" y="25" width="4" height="30" fill="#FFD700" opacity="0.5" />
          <rect x="5" y="37" width="30" height="4" fill="#FFD700" opacity="0.5" />
          <path d="M10 25 Q20 15 20 25 M20 25 Q20 15 30 25" stroke="#FFD700" strokeWidth="2" fill="none" opacity="0.5" />
          
          {/* Present 2 */}
          <rect x="40" y="35" width="25" height="25" fill="#228B22" opacity="0.3" rx="2" />
          <rect x="51" y="35" width="3" height="25" fill="#FF0000" opacity="0.5" />
          <rect x="40" y="45" width="25" height="3" fill="#FF0000" opacity="0.5" />
          <path d="M44 35 Q52 27 52 35 M52 35 Q52 27 61 35" stroke="#FF0000" strokeWidth="2" fill="none" opacity="0.5" />
        </svg>
      </motion.div>
    </div>
  );
};

export default ChristmasOrnaments;
