import { forwardRef } from "react";
import { Button as ReactAriaButton } from "react-aria-components";
import clsx from "clsx";
import { useButtonStyles, ButtonProps } from "../shared";
import { useNavigate } from "react-router-dom";

//Any extra implementations not in ReactAriaButton

export type NavButtonProps = Omit<ButtonProps, "onPress"> & {
  to: string;
  state?: any;
};

export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ to, state, ...props }, ref) => {
    const navigate = useNavigate();

    return (
      <ReactAriaButton
        {...props}
        className={clsx(useButtonStyles(props), props.className)}
        ref={ref}
        onPress={() => {
          navigate(to, { state: state });
        }}
      />
    );
  }
);
export default NavButton;
