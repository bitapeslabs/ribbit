import { Box, BoxProps } from "@/ui/components/base";
import clsx from "clsx";

import React from "react";

import styles from "./styles.module.css";

export type SeedphraseGridProps = {
  //BIP39 seedphrase has 12 words
  seedphrase: string[];
} & BoxProps;

export const SeedphraseGrid: React.FC<SeedphraseGridProps> = ({
  seedphrase,
  ...props
}) => {
  return (
    <Box className={styles.container}>
      <Box className={clsx(styles.grid_container, props.className)} {...props}>
        {seedphrase.map((word, index) => (
          <Box key={index} className={styles.seedphrase_word}>
            <Box className={styles.seedphrase_word_number}>{index + 1}</Box>
            <Box className={styles.seedphrase_word_text}>{word}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
