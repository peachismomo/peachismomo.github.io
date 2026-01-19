import { useState, type ReactNode } from "react";
import { ModeContext } from "../context/useModeContext";

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState<boolean>(true);
  return (
    <ModeContext.Provider
      value={{
        isDark: isDark,
        setIsDark: setIsDark,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export default DarkModeProvider;
