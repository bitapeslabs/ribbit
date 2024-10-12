import React, { forwardRef } from "react";

export type BoxProps = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ children, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

export default Box;
