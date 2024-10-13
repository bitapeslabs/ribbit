import React, { forwardRef } from "react";
import { TextSizes, TextSizesProps } from "../DesignToken";
import clsx from "clsx";
import styles from "./style.module.css";

export type TextProps = {
  children: string;
  size?: TextSizesProps;
} & React.HTMLAttributes<HTMLDivElement>;

export const Text = forwardRef<HTMLDivElement, TextProps>(
  ({ children, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{ fontSize: TextSizes[size || "sm"] }}
        {...props}
        className={clsx(props.className, styles.container)}
      >
        {children}
      </div>
    );
  }
);
export default Text;
