import { Box, Text, Button } from "@/components/karrot";
import styles from "./styles.module.css";
import PageContainer from "@/components/shared/PageContainer";
import { FrogIcon } from "@/components/shared/Icons";
import { Colors } from "@/components/karrot/DesignToken/colors";
import useMouseAndScreen from "@/hooks/useMouseAndScreen";
import clsx from "clsx";
export const Home: React.FC<{}> = () => {
  const { mousePosition, screenDimensions } = useMouseAndScreen();
  const { x } = mousePosition;
  const { width } = screenDimensions;

  const hopLeft = x > width / 2;

  return (
    <PageContainer hasGradient hasPadding>
      <Box className={styles.container}>
        <Box className={styles.header_container}>
          <Box className={styles.logo_container}>
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
            <Text size="xl" className={styles.logo_text}>
              ribbit
            </Text>
          </Box>
          <Text size="md">The ultimate wallet for Bitcoin assets</Text>
        </Box>
        <Box className={styles.button_container}>
          <Button variant="secondary">Create new wallet</Button>
          <Button variant="outline">Import existing wallet</Button>
        </Box>
      </Box>
    </PageContainer>
  );
};
