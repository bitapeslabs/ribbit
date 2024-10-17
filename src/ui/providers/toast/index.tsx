import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from "react";

import { Box } from "@/ui/components/base";
import styles from "./styles.module.css";

import clsx from "clsx";

const MAX_TOASTS = 5;

// Toast type definition
interface Toast {
  message: string;
  isVisible: boolean;
  id: string;
}

type Toasts = { [key: string]: Toast };

// Context types
interface ToastContextType {
  createToast: (message: string) => void;
  deleteToast: (id: string) => void;
  toasts: Toasts;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ToastProvider Component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toasts>({});

  const createToast = useCallback(
    (message: string) => {
      if (Object.values(toasts).length + 1 > MAX_TOASTS) return;

      const id = Math.random().toString(36).substring(7); // Generate a random ID
      setToasts((prev) => ({
        ...prev,
        [id]: { message, id, isVisible: false },
      }));
      // Automatically hide the toast after 3 seconds

      setTimeout(() => toggleToast(id, true), 10);

      setTimeout(() => deleteToast(id), 3000);
    },
    [toasts]
  );

  const deleteToast = useCallback((id: string) => {
    toggleToast(id, false);

    setTimeout(
      () =>
        setToasts((prev) => {
          const newToasts = { ...prev };
          delete newToasts[id];
          return newToasts;
        }),
      300
    );
  }, []);

  const toggleToast = useCallback((id: string, isVisible: boolean) => {
    setToasts((prev) => ({ ...prev, [id]: { ...prev[id], isVisible } }));
  }, []);

  return (
    <ToastContext.Provider value={{ createToast, deleteToast, toasts }}>
      {children}
      {/* Render the toasts */}
      <Box className={styles.container}>
        {Object.values(toasts).map((toast) => (
          <Box
            key={toast.id}
            className={clsx(
              styles.toast_container,
              toast.isVisible && styles.toast_visible
            )}
          >
            {toast.message}
          </Box>
        ))}
      </Box>
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
