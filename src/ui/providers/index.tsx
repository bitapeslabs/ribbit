import { ToastProvider } from "./toast";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ToastProvider>{children}</ToastProvider>;
};

export default Providers;
