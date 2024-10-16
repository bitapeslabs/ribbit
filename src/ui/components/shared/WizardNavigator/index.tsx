import React, { useState, ReactNode } from "react";
import { Box } from "@/ui/components/base";
import styles from "./styles.module.css";
import { ProgressIndicator } from "@/ui/components/base/ProgressIndicator";
import clsx from "clsx";
interface WizardNavigatorProps {
  children: ReactNode;
  WizardNavigatorControls: {
    nextStep: () => void;
    previousStep: () => void;
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  };
}

const WizardNavigator: React.FC<WizardNavigatorProps> = ({
  children,
  WizardNavigatorControls,
}) => {
  const childrenArray = React.Children.toArray(children);
  const { currentStep } = WizardNavigatorControls;

  return (
    <Box className={styles.container}>
      <Box className={styles.wizard_header}>
        <ProgressIndicator
          current={currentStep + 1}
          total={childrenArray.length}
        />
      </Box>
      <Box className={styles.pageContainer}>
        {childrenArray.map((child, index) => (
          <Box
            key={`wizard_nav_page_${index}`}
            className={clsx(
              styles.page,
              index === currentStep && styles.activePage
            )}
          >
            {child}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const useWizardNavigatorControls = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prevStep) => {
      return prevStep + 1;
    });
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => {
      return prevStep - 1;
    });
  };

  return {
    nextStep,
    previousStep,
    currentStep,
    setCurrentStep,
  };
};
export default WizardNavigator;