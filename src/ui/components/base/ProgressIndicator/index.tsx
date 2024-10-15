import { forwardRef } from "react";
import { Box, BoxProps } from "../Box";
import clsx from "clsx";
import styles from "./styles.module.css";

export type ProgressIndicatorProps = Omit<BoxProps, "children"> & {
  total: number;
  current: number;
};

export const ProgressIndicator = forwardRef<
  HTMLDivElement,
  ProgressIndicatorProps
>(({ total, current, ...props }, ref) => {
  return (
    <Box ref={ref} {...props} className={styles.container}>
      {Array.from({ length: total }, (_, i) => (
        <Box
          key={i}
          className={clsx(
            styles.circle_container,
            i === current - 1 && styles.active
          )}
        />
      ))}
    </Box>
  );
});

export default ProgressIndicator;
