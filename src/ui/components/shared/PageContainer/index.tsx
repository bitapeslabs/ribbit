import React from "react";
import Box from "@/ui/components/base/Box";

import styles from "./style.module.css";
import { useRef, useEffect } from "react";
import { extensionIsInTab } from "@/ui/hooks/browser";
// import { setInterval } from "timers/promises";

export type PageContainerProps = {
  children: React.ReactNode;
  hasPadding?: boolean;
  hasGradient?: boolean;
  hasBackground?: boolean;
};

const PageContainer: React.FC<PageContainerProps> = ({
  hasGradient,
  hasPadding,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkRef = async () => {
      const inTab = await extensionIsInTab();
      if (!inTab) {
        containerRef.current?.classList.add(styles.extension);
      }
    };

    checkRef();
  }, []);

  return (
    <Box className={styles.container} ref={containerRef}>
      {hasGradient && <Box className={styles.gradient} />}
      <Box className={styles.bg_container} />
      <Box
        className={styles.inner_page_container}
        style={{ padding: hasPadding ? "var(--default-padding)" : "0px" }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageContainer;
