import { Box, BoxProps } from "@/ui/components/base";
import clsx from "clsx";

import React from "react";

import styles from "./styles.module.css";

export type GridProps = {
  rows: number;
  columns: number;
  children: React.ReactElement<typeof Item>[];
} & BoxProps;

const Container: React.FC<GridProps> = ({
  children,
  rows,
  columns,
  ...props
}) => {
  return (
    <Box className={styles.container}>
      <Box
        className={clsx(styles.grid_container, props.className)}
        style={{
          gridTemplateColumns: `repeat(${columns}, 50%)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
        {...props}
      >
        {children}
      </Box>
    </Box>
  );
};

export type GridItemProps = {
  index: number;
  noOutline?: boolean;
  children: React.ReactNode;
};

const Item: React.FC<GridItemProps> = ({ index, noOutline, children }) => {
  return (
    <Box className={clsx(styles.grid_item, noOutline && styles.no_outline)}>
      <Box className={styles.grid_item_index}>{index}</Box>
      {children}
    </Box>
  );
};

export const Grid = {
  Container,
  Item,
};

export default Grid;
