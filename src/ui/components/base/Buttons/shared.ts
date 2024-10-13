import ButtonStyles from "./style.module.css";

import { clsx } from "clsx";
import { ButtonProps as ReactAriaButtonProps } from "react-aria-components";

type LocalButtonProps = {
  variant?:
    | "primary" //filled green
    | "secondary" //filled white
    | "outline"; //outlined
};
export type ButtonProps = LocalButtonProps &
  Omit<ReactAriaButtonProps, keyof LocalButtonProps>;

export const useButtonStyles = (props: ButtonProps) =>
  clsx(
    ButtonStyles.container,
    { [ButtonStyles.disabled]: props.isDisabled },
    ButtonStyles[props.variant ?? "primary"]
  );
