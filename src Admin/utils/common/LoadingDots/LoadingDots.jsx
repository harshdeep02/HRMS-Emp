import React from "react";

const LoadingDots = ({ color = "#fff", size = 8, speed = 0.6, dotCount = 3, gap = 8 }) => {
  const dots = Array.from({ length: dotCount });

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: `${gap}px` }}>
      {dots.map((_, i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: color,
            animation: `beat ${speed}s infinite ease-in-out`,
            animationDelay: `${i * speed * 0.3}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes beat {
          0%, 80%, 100% { transform: scale(0.3); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingDots;
