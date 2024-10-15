import { Box, Text, NavButton } from "@/ui/components/base";
import styles from "./styles.module.css";
import PageContainer from "@/ui/components/shared/PageContainer";
import { FrogIcon } from "@/ui/components/shared/Icons";

import { Colors } from "@/ui/components/base/DesignToken/colors";
import useMouseAndScreen from "@/ui/hooks/useMouseAndScreen";
import BlurAttach from "@/ui/components/shared/BlurAttach";
import { useRef } from "react";
import clsx from "clsx";
import GrafitiBackground from "@/ui/components/shared/GraffitiBackground";

export const Home: React.FC<{}> = () => {
  const { mousePosition, screenDimensions } = useMouseAndScreen();
  const { x } = mousePosition;
  const { width } = screenDimensions;

  const logoContainerRef = useRef<HTMLDivElement>(null);

  const hopLeft = x > width / 2;

  return (
    <PageContainer hasGradient hasPadding hasBackground>
      <GrafitiBackground seed={37}>
        <Text size="gorlock">Satoshi was here</Text>
        <Text size="gorlock">opcatopcatopcat</Text>
        <Text size="gorlock">ribbit ribbit</Text>
      </GrafitiBackground>
      <BlurAttach targetRef={logoContainerRef} />
      <Box className={styles.container}>
        <Box className={styles.header_container}>
          <FrogIcon
            width="60px"
            height={"60px"}
            color={Colors.primary}
            className={clsx(
              styles.frog,
              hopLeft && styles.frogLeft,
              !hopLeft && styles.frogRight
            )}
          />
          <Box className={styles.logo_container} ref={logoContainerRef}>
            <img src="/logotype.svg" />
          </Box>
          <Text size="lg" className={styles.header_text}>
            The Ultimate Wallet for Bitcoin assets and SlowFI
          </Text>
        </Box>
        <Box className={styles.button_container}>
          <NavButton variant="secondary" to="/create-wallet">
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
