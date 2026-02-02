"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";

interface OfflineIndicatorProps {
  isOffline: boolean;
}

export function OfflineIndicator({ isOffline }: OfflineIndicatorProps) {
  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          <WifiOff size={16} />
          <span>You&apos;re offline - changes saved locally</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
