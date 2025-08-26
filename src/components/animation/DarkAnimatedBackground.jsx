import React, { useEffect, useState } from "react";

const DarkAnimatedBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const initialParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 10,
    }));
    setParticles(initialParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gray-900 z-0">
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 bg-[length:200%_200%] animate-gradient-xy"></div>
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-grid bg-cover animate-soft-pulse"></div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-purple-500 opacity-30 animate-float"
            style={{
              top: `${particle.y}%`,
              left: `${particle.x}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Subtle glow effects */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-purple-900 opacity-20 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-indigo-900 opacity-20 blur-3xl animate-pulse-slow"></div>
    </div>
  );
};

export default DarkAnimatedBackground;
