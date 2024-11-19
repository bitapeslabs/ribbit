import React, { useState, ReactNode, createContext, useContext } from "react";
import { Box, Button } from "@/ui/components/base";
import styles from "./styles.module.css";
import { IconArrowBack } from "@tabler/icons-react";
import { ProgressIndicator } from "@/ui/components/base";
import clsx from "clsx";

export type WizardNavigatorControlsProps = {
  nextStep: () => void;
  previousStep: () => void;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  submitAll: () => void;
};

interface WizardNavigatorProps {
  children: ReactNode;
  WizardNavigatorControls: WizardNavigatorControlsProps;
}

const WizardNavigatorControlsContext = createContext<
  WizardNavigatorControlsProps | undefined
>(undefined);

const WizardNavigator: React.FC<WizardNavigatorProps> = ({
  children,
  WizardNavigatorControls,
}) => {
  const childrenArray = React.Children.toArray(children);
  const { currentStep, previousStep } = WizardNavigatorControls;

  return (
    <WizardNavigatorControlsContext.Provider value={WizardNavigatorControls}>
      <Box className={styles.container}>
        <Box className={styles.wizard_header}>
          <Button
            onPress={previousStep}
            variant="outline"
            isDisabled={currentStep === 0}
            containerProps={{
              style: {
                visibility: currentStep !== 0 ? "visible" : "hidden",
              },
            }}
            className={styles.backButton}
            fitContent
          >
            <IconArrowBack />
          </Button>
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
    </WizardNavigatorControlsContext.Provider>
  );
};

export const createWizardNavigatorControls = (
  onSubmit: () => void,

  defaultPage?: number
): WizardNavigatorControlsProps => {
  const [currentStep, setCurrentStep] = useState(defaultPage || 0);

  const nextStep = () => {
    setCurrentStep((prevStep) => {
      return prevStep + 1;
    });
  };

  const submitAll = onSubmit;

  const previousStep = () => {
    setCurrentStep((prevStep) => {
      return prevStep - 1 > 0 ? prevStep - 1 : 0;
    });
  };

  return {
    nextStep,
    previousStep,
    currentStep,
    setCurrentStep,
    submitAll,
  };
};

export const useWizardNavigatorControls = (): WizardNavigatorControlsProps => {
  const context = useContext(WizardNavigatorControlsContext);
  if (!context) {
    throw new Error("useCounter must be used within a CounterProvider");
  }
  return context;
};

export default WizardNavigator;
