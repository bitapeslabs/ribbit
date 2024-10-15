import React, { useEffect, useRef } from "react";
import Box from "@/ui/components/base/Box";
import styles from "./styles.module.css";

interface BlurAttachProps {
  targetRef: React.RefObject<HTMLElement>;
}

const BlurAttach: React.FC<BlurAttachProps> = ({ targetRef }) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (targetRef.current && boxRef.current) {
        const targetRect = targetRef.current.getBoundingClientRect();
        const box = boxRef.current;

        // Calculate center position of the target component
        const centerX = targetRect.left + targetRect.width / 2;
        const centerY = targetRect.top + targetRect.height / 2;

        // Position the Box at the center of the target component
        box.style.position = "fixed";
        box.style.left = `${centerX}px`;
        box.style.top = `${centerY}px`;
        box.style.transform = "translate(-50%, -50%)"; // Adjust for Box size
      }
    };

    updatePosition(); // Initial position

    // Observe changes to the target element's size and position
    let resizeObserver: ResizeObserver;
    if (targetRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updatePosition();
      });
      resizeObserver.observe(targetRef.current);
    }

    // Update position on window events
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      if (resizeObserver && targetRef.current) {
        resizeObserver.unobserve(targetRef.current);
      }
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [targetRef.current]); // Depend on targetRef.current

  return <Box ref={boxRef} className={styles.container} />;
};

export default BlurAttach;
