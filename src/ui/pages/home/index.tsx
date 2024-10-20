import { Box, Text, NavButton } from "@/ui/components/base";
import styles from "./styles.module.css";
import PageContainer from "@/ui/components/shared/PageContainer";
import Frog from "@/ui/components/shared/Frog";

import BlurAttach from "@/ui/components/shared/BlurAttach";
import { useRef } from "react";
//import { extensionIsInTab } from "@/ui/hooks/browser";

export const Home: React.FC<{}> = () => {
  const logoContainerRef = useRef<HTMLDivElement>(null);

  return (
    <PageContainer hasGradient hasPadding>
      <BlurAttach targetRef={logoContainerRef} />
      <Box className={styles.container}>
        <Box className={styles.header_container}>
          <Frog />

          <Box className={styles.logo_container} ref={logoContainerRef}>
            <img src="/logotype.svg" />
          </Box>
          <Text size="lg" className={styles.header_text}>
            The Ultimate Wallet for Bitcoin assets and SlowFI
          </Text>
        </Box>
        <Box className={styles.button_container}>
          <NavButton variant="primary" to="/create-wallet">
            Create new wallet
          </NavButton>
          <NavButton variant="outline" to="/import-wallet">
            Import existing wallet
          </NavButton>
        </Box>
      </Box>
    </PageContainer>
  );
};
