import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ZapOff, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { usePerformance } from "@/hooks/usePerformance";
import { useLanguage } from "@/hooks/useLanguage";

const PerformanceIndicator = () => {
  const { t } = useLanguage();
  const {
    isLiteMode,
    setLiteMode,
    metrics,
    animationQuality,
    particleCount,
    videoQuality,
  } = usePerformance();

  const [isOpen, setIsOpen] = useState(false);

  const labels = {
    title: t("perf.title"),
    liteMode: t("perf.liteMode"),
    liteModeDesc: t("perf.liteModeDesc"),
    fps: t("perf.fps"),
    quality: t("perf.quality"),
    particles: t("perf.particles"),
    video: t("perf.video"),
    device: t("perf.device"),
    lowEnd: t("perf.lowEnd"),
    standard: t("perf.standard"),
    mobile: t("perf.mobile"),
    desktop: t("perf.desktop"),
  };

  const qualityLabels = {
    high: t("perf.high"),
    medium: t("perf.medium"),
    low: t("perf.low"),
    disabled: t("perf.disabled"),
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative overflow-hidden group box-glow-hover"
          aria-label={labels.title}
        >
          <AnimatePresence mode="wait">
            {isLiteMode ? (
              <motion.div
                key="lite"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <ZapOff className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="full"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Zap className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* FPS indicator dot */}
          <span
            className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
              metrics.fps >= 50
                ? "bg-green-500"
                : metrics.fps >= 30
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent align="end" className="w-72">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            <h4 className="font-medium">{labels.title}</h4>
          </div>

          {/* Lite Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">{labels.liteMode}</label>
              <p className="text-xs text-muted-foreground">{labels.liteModeDesc}</p>
            </div>
            <Switch
              checked={isLiteMode}
              onCheckedChange={setLiteMode}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
            {/* FPS */}
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">{labels.fps}</span>
              <div className="flex items-center gap-1">
                <span
                  className={`text-sm font-mono font-medium ${
                    metrics.fps >= 50
                      ? "text-green-500"
                      : metrics.fps >= 30
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {metrics.fps}
                </span>
              </div>
            </div>

            {/* Animation Quality */}
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">{labels.quality}</span>
              <span className="text-sm font-medium capitalize">
                {qualityLabels[animationQuality]}
              </span>
            </div>

            {/* Particle Count */}
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">{labels.particles}</span>
              <span className="text-sm font-medium">{particleCount}</span>
            </div>

            {/* Video Quality */}
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">{labels.video}</span>
              <span className="text-sm font-medium capitalize">
                {qualityLabels[videoQuality] || videoQuality}
              </span>
            </div>

            {/* Device Type */}
            <div className="space-y-1 col-span-2">
              <span className="text-xs text-muted-foreground">{labels.device}</span>
              <span className="text-sm font-medium">
                {metrics.isMobile ? labels.mobile : labels.desktop}
                {" · "}
                {metrics.isLowEndDevice ? labels.lowEnd : labels.standard}
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PerformanceIndicator;
