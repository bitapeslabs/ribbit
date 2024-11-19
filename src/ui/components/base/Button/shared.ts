import ButtonStyles from "./styles.module.css";

import { clsx } from "clsx";
import { ButtonProps as ReactAriaButtonProps } from "react-aria-components";
import { BoxProps } from "@/ui/components/base/Box";

type LocalButtonProps = {
  containerProps?: BoxProps; //Props for the container
  variant?:
    | "primary" //filled green
    | "secondary" //filled white
    | "outline"; //outlined

  fitContent?: boolean; //If true, the button will fit the content rather than being full width. Useful shorthand
};
export type ButtonProps = LocalButtonProps &
  Omit<ReactAriaButtonProps, keyof LocalButtonProps>;

export const useButtonStyles = (props: ButtonProps) =>
  clsx(
    ButtonStyles.outer_container,
    ButtonStyles[props.variant ?? "primary"],
    props.isDisabled && ButtonStyles.disabled,
    props.fitContent && ButtonStyles.fit_content
  );
