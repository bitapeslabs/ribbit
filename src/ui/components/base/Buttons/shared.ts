import ButtonStyles from "./styles.module.css";

import { clsx } from "clsx";
import { ButtonProps as ReactAriaButtonProps } from "react-aria-components";

type LocalButtonProps = {
  variant?:
    | "primary" //filled green
    | "secondary" //filled white
    | "outline"; //outlined

  buttonClassName?: string; //This is the class name for the actual button, "className" is passed to the container
};
export type ButtonProps = LocalButtonProps &
  Omit<ReactAriaButtonProps, keyof LocalButtonProps>;

export const useButtonStyles = (props: ButtonProps) =>
  clsx(
    ButtonStyles.outer_container,
    ButtonStyles[props.variant ?? "primary"],
    props.isDisabled && ButtonStyles.disabled
  );
