import React from "react";
import Box from "@/ui/components/base/Box";
import { useState } from "react";
import styles from "./styles.module.css";
import { NavButton, ProgressIndicator } from "@/ui/components/base";

// import { setInterval } from "timers/promises";

export type PageContainerProps = {
  children: React.ReactNode;
};

export type PageProps = {
  children: React.ReactNode;
};

const container: React.FC<PageContainerProps> = ({ children }) => {
  const [form, setForm] = useState<any>({});
  const [current, setCurrent] = useState(0);

  const Pages = React.Children.toArray(children);

  return (
    <Box className={styles.container}>
      <ProgressIndicator total={Pages.length} current={current} />
      {Pages.map((page: React.ReactNode, index: number) => {
        return null;
      })}
    </Box>
  );
};

export default {
  container,
};
