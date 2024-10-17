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
  label?: string;
  errorControls?: ErrorControlsProps;
  textFieldProps?: TextFieldProps;
  indicator?: TextInputIndicator;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, textFieldProps, errorControls, indicator, ...props }, ref) => {
    const indicatorRef = useRef<HTMLDivElement>(null);

    return (
      <Box className={styles.outer_container}>
        <TextField
          {...textFieldProps}
          className={clsx(
            styles.text_field_container,
            textFieldProps?.className
          )}
        >
          <Label style={{ display: label ? "block" : "none" }}>
            {label && <Text size="sm">{label}</Text>}
          </Label>
          <Input
            {...(props as InputProps)}
            ref={ref}
            className={clsx(
              styles.container,
              errorControls?.error && styles.error,
              props.className
            )}
            style={{
              ...props?.style,
              ...(indicatorRef.current && {
                width: `calc(100% - ${
                  indicatorRef.current?.clientWidth + Paddings.small * 2
                }px - var(--padding-small))`,
                paddingRight: `${
                  indicatorRef.current?.clientWidth + Paddings.small * 2
                }px`,
              }),
            }}
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
          <Text color="errorLight" size="sm">
            <IconAlertTriangleFilled color={Colors.error} size="18px" />
            &nbsp;&nbsp;
            {errorControls.error}
          </Text>
        )}
      </Box>
    );
  }
);
export default TextInput;
