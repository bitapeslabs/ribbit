import { forwardRef } from "react";
import { Box, BoxProps } from "../../Box";
import clsx from "clsx";
import styles from "./styles.module.css";
import { IndicatorSizesProps, IndicatorSizes } from "../../DesignToken";
import { hasSymbol } from "@/ui/validators";

type PasswordStrength = "none" | "weak" | "medium" | "strong";

export type PasswordStrengthIndicatorProps = Omit<BoxProps, "children"> & {
  password: string;
  size?: IndicatorSizesProps;
};

const getPasswordStrength = (password: string): PasswordStrength => {
  let strength = 0;
  if (password.length) {
    strength++;
  }

  if (
    password.toLowerCase() !== password &&
    password.toUpperCase() !== password &&
    password.length > 7
  ) {
    strength++;
  }

  if (hasSymbol(password) && !password.includes(" ")) {
    strength++;
  }

  return (["none", "weak", "medium", "strong"] as Array<PasswordStrength>)[
    strength
  ];
};

export const PasswordStrengthIndicator = forwardRef<
  HTMLDivElement,
  PasswordStrengthIndicatorProps
>(({ size = "sm", password, ...props }, ref) => {
  const circleStyle = {
    width: IndicatorSizes[size],
    height: IndicatorSizes[size],
  };
  const passwordStrength = getPasswordStrength(password);
  return (
    <Box
      ref={ref}
      {...props}
      className={styles.container}
      style={{
        gap: `calc(${circleStyle.width} / 2 )`,
      }}
    >
      <Box
        className={clsx(
          styles.circle_container,
          passwordStrength === "strong" && styles.circle_green,
          passwordStrength === "medium" && styles.circle_yellow,
          passwordStrength === "weak" && styles.circle_red
        )}
        style={circleStyle}
      />
      <Box
        className={clsx(
          styles.circle_container,
          passwordStrength === "strong" && styles.circle_green,
          passwordStrength === "medium" && styles.circle_yellow
        )}
        style={circleStyle}
      />
      <Box
        className={clsx(
          styles.circle_container,
          passwordStrength === "strong" && styles.circle_green
        )}
        style={circleStyle}
      />
    </Box>
  );
});

export default PasswordStrengthIndicator;
