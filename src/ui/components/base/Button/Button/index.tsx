import { forwardRef, useRef } from "react";
import { Button as ReactAriaButton } from "react-aria-components";
import { Box } from "@/ui/components/base";
import clsx from "clsx";
import { useButtonStyles, ButtonProps } from "../shared";
import useMouseAndScreen from "@/ui/hooks/useMouseAndScreen";
import styles from "../styles.module.css";
//Any extra implementations not in ReactAriaButton

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { mousePosition } = useMouseAndScreen();

    const outerContainerRef = useRef<HTMLDivElement>(null);
    let rect;

    if (outerContainerRef.current) {
      rect = outerContainerRef.current.getBoundingClientRect();
    }

    let mouseX = mousePosition.x - (rect?.left || 0);
    let mouseY = mousePosition.y - (rect?.top || 0);

    return (
      <Box
        {...props.containerProps}
        className={clsx(useButtonStyles(props), props.className)}
        ref={outerContainerRef}
      >
        {rect && !props.isDisabled && (
          <Box
            className={styles.mouse_blur}
            style={{ top: `${mouseY}px`, left: `${mouseX}px` }}
          />
        )}

        <ReactAriaButton
          {...props}
          className={clsx(
            props.buttonClassName,
            props.isDisabled && styles.disabled,
            styles.container
          )}
          ref={ref}
        />
      </Box>
    );
  }
);
export default Button;
