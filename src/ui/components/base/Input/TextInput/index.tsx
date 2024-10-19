import { forwardRef, useRef } from "react";
import {
  TextField,
  Input,
  Label,
  TextFieldProps,
  InputProps,
} from "react-aria-components";
import clsx from "clsx";
import styles from "./styles.module.css";
import { Text, Box } from "@/ui/components/base";
import { Colors } from "@/ui/components/base/DesignToken";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import { Paddings } from "@/ui/components/base/DesignToken";
//Any extra implementations not in ReactAriaButton

export type TextInputIndicator = React.ReactNode;

export type ErrorControlsProps = {
  error: string;

  //To reset error message on first input
  setError: React.Dispatch<React.SetStateAction<string>>;
};

//invalid prop is omitted because we are using errorControls to handle errors
export type TextInputProps = Omit<InputProps, "invalid"> & {
  label?: React.ReactNode;
  errorControls?: ErrorControlsProps;
  textFieldProps?: TextFieldProps;
  indicator?: TextInputIndicator;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, textFieldProps, errorControls, indicator, ...props }, ref) => {
    const indicatorRef = useRef<HTMLDivElement>(null);

    const indicatorPadding =
      (indicatorRef.current?.getBoundingClientRect().width || 0) +
      Paddings.small * 2;

    const inputStyles = {
      ...props?.style,

      //Indicator takes space inside the component, we want to allocate some space for it and adjust the width of the input accordingly
      ...(indicator && {
        width: `calc(100% - ${indicatorPadding}px - var(--padding-small))`,
        paddingRight: `${indicatorPadding}px`,
      }),
    };

    return (
      <Box className={styles.outer_container}>
        <TextField
          {...textFieldProps}
          className={clsx(
            styles.text_field_container,
            textFieldProps?.className
          )}
        >
          <Label
            style={{ display: label ? "flex" : "none" }}
            className={styles.input_label}
          >
            {label || ""}
          </Label>
          <Input
            {...(props as InputProps)}
            ref={ref}
            className={clsx(
              styles.container,
              errorControls?.error && styles.error,
              props.className
            )}
            style={inputStyles}
            {...(errorControls?.error && {
              onInput: () => errorControls.setError(""),
            })}
          />

          {indicator && (
            <Box className={styles.indicator_container} ref={indicatorRef}>
              {indicator}
            </Box>
          )}
        </TextField>
        {errorControls?.error && (
          <Box className={styles.error_text_container}>
            <IconAlertTriangleFilled color={Colors.error} size="18px" />
            <Text color="errorLight" size="sm">
              {errorControls.error}
            </Text>
          </Box>
        )}
      </Box>
    );
  }
);
export default TextInput;
