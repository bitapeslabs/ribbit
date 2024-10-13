import { forwardRef } from "react";
import { Button as ReactAriaButton } from "react-aria-components";
import clsx from "clsx";
import { useButtonStyles, ButtonProps } from "../shared";

//Any extra implementations not in ReactAriaButton

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return (
      <ReactAriaButton
        {...props}
        className={clsx(useButtonStyles(props), props.className)}
        ref={ref}
      />
    );
  }
);
export default Button;
