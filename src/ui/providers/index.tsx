import { ToastProvider } from "./toast";
import { Provider } from "react-redux";
import { store } from "@/ui/state/store";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <ToastProvider>{children}</ToastProvider>
    </Provider>
  );
};

export default Providers;
