import React from "react";
import { Box } from "@/ui/components/base";
import styles from "./styles.module.css";

interface GrafitiBackgroundProps {
  children: React.ReactNode[];
  seed: number;
}

// Seeded random number generator function (Mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GrafitiBackground: React.FC<GrafitiBackgroundProps> = ({
  children,
  seed,
}) => {
  const items = (() => {
    const numChildren = React.Children.count(children);

    const gridCols = Math.ceil(Math.sqrt(numChildren));
    const gridRows = Math.ceil(numChildren / gridCols);

    const random = mulberry32(seed);

    const cells = Array.from({ length: numChildren }, (_, index) => ({
      col: index % gridCols,
      row: Math.floor(index / gridCols),
    })).sort(() => random() - 0.5);

    return React.Children.map(children, (child, index) => {
      const cell = cells[index];
      const cellWidth = 100 / gridCols;
      const cellHeight = 100 / gridRows;

      const x =
        cell.col * cellWidth + cellWidth * 0.1 + random() * cellWidth * 0.8;
      const y =
        cell.row * cellHeight + cellHeight * 0.1 + random() * cellHeight * 0.8;

      const rotation = random() * 180 - 90;

      const style: React.CSSProperties = {
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        whiteSpace: "nowrap",
      };

      return (
        <Box style={style} key={index}>
          {child}
        </Box>
      );
    });
  })();
  //}, []); // Empty dependency array ensures this runs only once

  return <Box className={styles.container}>{items}</Box>;
};

export default GrafitiBackground;
