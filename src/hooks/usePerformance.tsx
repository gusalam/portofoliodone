import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

interface PerformanceMetrics {
  deviceMemory: number | null;
  hardwareConcurrency: number;
  connectionType: string | null;
  isLowEndDevice: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  fps: number;
}

interface PerformanceContextType {
  isLiteMode: boolean;
  setLiteMode: (enabled: boolean) => void;
  metrics: PerformanceMetrics;
  particleCount: number;
  animationQuality: "high" | "medium" | "low";
  shouldReduceAnimations: boolean;
  videoQuality: "high" | "low" | "disabled";
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

// Detect device capabilities
function detectDeviceCapabilities(): PerformanceMetrics {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: {
      effectiveType?: string;
      saveData?: boolean;
    };
  };

  // Device memory (in GB)
  const deviceMemory = nav.deviceMemory ?? null;

  // CPU cores
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;

  // Connection type
  const connectionType = nav.connection?.effectiveType ?? null;
  const saveData = nav.connection?.saveData ?? false;

  // Check for mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Determine if low-end device
  const isLowEndDevice =
    (deviceMemory !== null && deviceMemory < 4) ||
    hardwareConcurrency < 4 ||
    connectionType === "slow-2g" ||
    connectionType === "2g" ||
    saveData ||
    prefersReducedMotion;

  return {
    deviceMemory,
    hardwareConcurrency,
    connectionType,
    isLowEndDevice,
    isMobile,
    prefersReducedMotion,
    fps: 60, // Will be updated by FPS monitor
  };
}

// FPS Monitor
function createFPSMonitor(onUpdate: (fps: number) => void) {
  let frameCount = 0;
  let lastTime = performance.now();
  let animationId: number;

  const measure = () => {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      onUpdate(fps);
      frameCount = 0;
      lastTime = currentTime;
    }

    animationId = requestAnimationFrame(measure);
  };

  animationId = requestAnimationFrame(measure);

  return () => cancelAnimationFrame(animationId);
}

const LITE_MODE_STORAGE_KEY = "performance-lite-mode";

export const PerformanceProvider = ({ children }: { children: ReactNode }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(() =>
    detectDeviceCapabilities()
  );

  const [isLiteMode, setLiteModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LITE_MODE_STORAGE_KEY);
      if (saved !== null) {
        return saved === "true";
      }
      // Auto-enable for low-end devices
      return detectDeviceCapabilities().isLowEndDevice;
    } catch {
      return false;
    }
  });

  // Monitor FPS
  useEffect(() => {
    let lowFPSCount = 0;

    const cleanup = createFPSMonitor((fps) => {
      setMetrics((prev) => ({ ...prev, fps }));

      // Auto-enable lite mode if FPS drops below 30 for 3 consecutive seconds
      if (fps < 30) {
        lowFPSCount++;
        if (lowFPSCount >= 3 && !isLiteMode) {
          setLiteModeState(true);
          localStorage.setItem(LITE_MODE_STORAGE_KEY, "true");
        }
      } else {
        lowFPSCount = 0;
      }
    });

    return cleanup;
  }, [isLiteMode]);

  // Listen for reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      setMetrics((prev) => ({ ...prev, prefersReducedMotion: e.matches }));
      if (e.matches) {
        setLiteModeState(true);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Listen for resize
  useEffect(() => {
    const handleResize = () => {
      setMetrics((prev) => ({
        ...prev,
        isMobile: window.innerWidth < 768,
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const setLiteMode = (enabled: boolean) => {
    setLiteModeState(enabled);
    try {
      localStorage.setItem(LITE_MODE_STORAGE_KEY, String(enabled));
    } catch (error) {
      console.error("Error saving lite mode preference:", error);
    }
  };

  // Calculate derived values
  const derivedValues = useMemo(() => {
    // Particle count based on mode and device
    let particleCount: number;
    if (isLiteMode) {
      particleCount = 5;
    } else if (metrics.isMobile) {
      particleCount = 15;
    } else if (metrics.isLowEndDevice) {
      particleCount = 20;
    } else {
      particleCount = 40;
    }

    // Animation quality
    let animationQuality: "high" | "medium" | "low";
    if (isLiteMode || metrics.prefersReducedMotion) {
      animationQuality = "low";
    } else if (metrics.isMobile || metrics.isLowEndDevice) {
      animationQuality = "medium";
    } else {
      animationQuality = "high";
    }

    // Should reduce animations
    const shouldReduceAnimations =
      isLiteMode || metrics.prefersReducedMotion || metrics.fps < 30;

    // Video quality
    let videoQuality: "high" | "low" | "disabled";
    if (isLiteMode && metrics.isMobile) {
      videoQuality = "disabled";
    } else if (isLiteMode || metrics.isMobile || metrics.isLowEndDevice) {
      videoQuality = "low";
    } else {
      videoQuality = "high";
    }

    return {
      particleCount,
      animationQuality,
      shouldReduceAnimations,
      videoQuality,
    };
  }, [isLiteMode, metrics]);

  return (
    <PerformanceContext.Provider
      value={{
        isLiteMode,
        setLiteMode,
        metrics,
        ...derivedValues,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error("usePerformance must be used within a PerformanceProvider");
  }
  return context;
};

export default usePerformance;
