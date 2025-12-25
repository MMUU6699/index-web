"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

const isNewYearPeriod = (): boolean => {
  const now = new Date();
  const start = new Date("2025-12-24T00:00:00");
  const end = new Date("2026-01-02T23:59:59");
  return now >= start && now <= end;
};

interface Snowflake {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

const Snowfall: React.FC = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showSnow, setShowSnow] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const animationRef = useRef<number | null>(null);

  const isPlayerPage = pathname.includes("/player");

  useEffect(() => {
    setMounted(true);
    setShowSnow(isNewYearPeriod());
  }, []);

  useEffect(() => {
    if (!showSnow || isPlayerPage || !mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create snowflakes
    const createSnowflake = (id: number, startY?: number): Snowflake => ({
      id,
      x: Math.random() * canvas.width,
      y: startY ?? Math.random() * -100,
      size: 1.5 + Math.random() * 3,
      speedY: 0.5 + Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: 0.4 + Math.random() * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    });

    // Initialize snowflakes
    snowflakesRef.current = Array.from({ length: 80 }, (_, i) =>
      createSnowflake(i, Math.random() * canvas.height)
    );

    const drawSnowflake = (flake: Snowflake) => {
      ctx.save();
      ctx.translate(flake.x, flake.y);
      ctx.rotate(flake.rotation);
      ctx.globalAlpha = flake.opacity;
      
      // Draw a simple snowflake shape
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, flake.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = flake.size * 2;
      ctx.beginPath();
      ctx.arc(0, 0, flake.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snowflakesRef.current = snowflakesRef.current.map((flake) => {
        const newY = flake.y + flake.speedY;
        const newX = flake.x + flake.speedX + Math.sin(flake.rotation) * 0.3;
        const newRotation = flake.rotation + flake.rotationSpeed;

        // Reset snowflake when it goes off screen
        if (newY > canvas.height + 10) {
          return createSnowflake(flake.id, -10);
        }

        // Wrap horizontally
        if (newX > canvas.width + 10) newX = -10;
        if (newX < -10) newX = canvas.width + 10;

        drawSnowflake({
          ...flake,
          x: newX,
          y: newY,
          rotation: newRotation,
        });

        return {
          ...flake,
          x: newX,
          y: newY,
          rotation: newRotation,
        };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showSnow, isPlayerPage, mounted]);

  if (!mounted || !showSnow || isPlayerPage) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 50 }}
      aria-hidden="true"
    />
  );
};

export default Snowfall;
