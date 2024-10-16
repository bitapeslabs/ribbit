import React, { forwardRef } from "react";
import { TextSizes, TextSizesProps } from "../DesignToken";
import clsx from "clsx";
import styles from "./style.module.css";
import { Colors } from "../DesignToken/colors";

export type TextProps = {
  children: string;
  color?: keyof typeof Colors;
  size?: TextSizesProps;
} & React.HTMLAttributes<HTMLDivElement>;

export const Text = forwardRef<HTMLDivElement, TextProps>(
  ({ children, color, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          fontSize: TextSizes[size || "sm"],
          ...(color && { color: Colors[color] }),
        }}
        {...props}
        className={clsx(styles.container, props.className)}
      >
        {children}
      </div>
    );
  }
);
export default Text;
