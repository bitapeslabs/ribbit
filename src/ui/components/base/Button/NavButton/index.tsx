import { forwardRef } from "react";
import { ButtonProps } from "../shared";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
//Any extra implementations not in ReactAriaButton

export type NavButtonProps = Omit<ButtonProps, "onPress"> & {
  to: string;
  state?: any;
};

export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ to, state, ...props }, ref) => {
    const navigate = useNavigate();

    return (
      <Button
        {...props}
        //This is clsxed in the Button Component
        className={props.className}
        ref={ref}
        onPress={() => {
          navigate(to, { state: state });
        }}
      />
    );
  }
);
export default NavButton;
