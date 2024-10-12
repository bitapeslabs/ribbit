import React from "react";
import Box from "@/components/karrot/Box";

import styles from "./style.module.css";

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
  return (
    <Box className={styles.container}>
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
