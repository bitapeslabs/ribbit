"use client";
import React, { forwardRef, useState } from "react";
import { Box, BoxProps } from "@/ui/components/base";
import clsx from "clsx";

import styles from "./styles.module.css";

export type TooltipContainerProps = {
  position?: "top" | "right" | "bottom" | "left";

  // This overrides the content prop of React.ReactNode which is why its omitted later
  content?: string | React.ReactNode;
} & Omit<BoxProps, "content">;

const Tooltip: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box {...props} className={clsx(styles.tooltip, props.className)}>
      <Box className={styles.tooltip_content}>{children}</Box>
    </Box>
  );
};

export const TooltipContainer = forwardRef<
  HTMLDivElement,
  TooltipContainerProps
>(({ children, position = "top", content, ...props }, ref) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <Box
      ref={ref}
      {...props}
      className={clsx(styles.tooltip_container, props.className)}
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
    >
      {children}
      <Tooltip
        className={clsx(
          tooltipVisible && styles.tooltip_visible,
          styles["tooltip_" + position]
        )}
      >
        <Box className={styles.tooltip_arrow} />
        {content}
      </Tooltip>
    </Box>
  );
});

export default TooltipContainer;
