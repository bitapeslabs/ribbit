import { forwardRef } from "react";
import {
  TextField,
  Input,
  Label,
  TextFieldProps,
  InputProps,
} from "react-aria-components";
import clsx from "clsx";
import styles from "./styles.module.css";
//Any extra implementations not in ReactAriaButton

export type TextInputProps = InputProps & {
  label?: React.ReactNode;
  TextFieldProps?: TextFieldProps;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, TextFieldProps, ...props }, ref) => {
    return (
      <TextField
        {...TextFieldProps}
        className={clsx(styles.outer_container, TextFieldProps?.className)}
      >
        <Label style={{ display: label ? "block" : "none" }}>{label}</Label>
        <Input
          {...(props as InputProps)}
          ref={ref}
          className={clsx(styles.container, props.className)}
        />
      </TextField>
    );
  }
);
export default TextInput;
