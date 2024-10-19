import { forwardRef } from "react";
import {
  Checkbox as ReactAriaCheckbox,
  CheckboxProps as ReactAriaCheckboxProps,
} from "react-aria-components";
import { Box, Text } from "@/ui/components/base";

import clsx from "clsx";

import styles from "./styles.module.css";

export type CheckboxProps = {
  children: string;
  isSelected: boolean;
} & Omit<ReactAriaCheckboxProps, "children" | "isSelected">;

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  ({ children, isSelected, ...props }, ref) => {
    return (
      <ReactAriaCheckbox
        {...props}
        className={clsx(styles.container, props.className)}
        ref={ref}
      >
        <Box className={styles.checkbox}>
          <svg viewBox="0 0 18 18" aria-hidden="true">
            <polyline points="1 9 7 14 15 4" />
          </svg>
        </Box>
        <Text size="sm" color={isSelected ? "secondary" : "dimmed"}>
          {children}
        </Text>
      </ReactAriaCheckbox>
    );
  }
);

export default Checkbox;
