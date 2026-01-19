import { createContext, useContext } from "react";

export interface ModeType {
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ModeContext = createContext<ModeType | undefined>(undefined);

export function useModeContext() {
  const ctx = useContext(ModeContext);
  if (!ctx)
    throw new Error("useModeContext must be used inside DarkModeProvider");
  return ctx;
}
