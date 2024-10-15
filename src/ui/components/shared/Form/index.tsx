import React from "react";
import Box from "@/ui/components/base/Box";
import styles from "./styles.module.css";

// import { setInterval } from "timers/promises";

export type FormProps = {
  children: React.ReactNode;
};

export const Form: React.FC<FormProps> = ({}) => {
  return <Box className={styles.container}></Box>;
};

export default Form;
