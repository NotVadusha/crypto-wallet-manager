"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";

export const motionButtonPreset = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.97 },
} as const;

type MotionButtonProps = HTMLMotionProps<"button">;

const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ whileHover, whileTap, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        type="button"
        whileHover={whileHover ?? motionButtonPreset.whileHover}
        whileTap={whileTap ?? motionButtonPreset.whileTap}
        {...props}
      />
    );
  }
);

export { MotionButton };
