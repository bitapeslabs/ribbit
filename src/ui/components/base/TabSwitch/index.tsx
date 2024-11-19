import React, { forwardRef } from "react";
import { Box, BoxProps } from "@/ui/components/base/Box";
import { Button } from "@/ui/components/base";
import styles from "./styles.module.css";
import clsx from "clsx";

export type TabSwitch = {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
} & BoxProps;

export const TabSwitch = forwardRef<HTMLDivElement, TabSwitch>(
  ({ children, className, tabs, activeTab, onTabChange, ...props }, ref) => {
    return (
      <Box ref={ref} className={clsx(className, styles.container)} {...props}>
        {tabs.map((tab) => (
          <Button
            key={tab}
            onPress={() => onTabChange(tab)}
            className={clsx(styles.tab, tab === activeTab && styles.active)}
            variant="secondary"
          >
            {tab}
          </Button>
        ))}
      </Box>
    );
  }
);

export default TabSwitch;
