import { Box, Text, NavButton } from "@/ui/components/base";
import PageContainer from "@/ui/components/shared/PageContainer";

import BlurAttach from "@/ui/components/shared/BlurAttach";
import { useRef } from "react";
import { ProgressIndicator } from "@/ui/components/base/ProgressIndicator";

export const CreateWallet: React.FC<{}> = () => {
  const blurRef = useRef<HTMLDivElement>(null);

  return (
    <PageContainer hasGradient hasPadding hasBackground>
      <ProgressIndicator total={5} current={1} />
      <BlurAttach targetRef={blurRef} />
      <Box>
        <Box ref={blurRef}>
          <Text size="xl"> hey</Text>
        </Box>
      </Box>
    </PageContainer>
  );
};
