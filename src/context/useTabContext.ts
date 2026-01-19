import { type RefObject, createContext, useContext } from "react";

export interface TabContextType {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  suppressObserver: boolean;
  setSuppressObserver: (val: boolean) => void;
}

export interface ElementContextType {
  elements: RefObject<HTMLElement | null>[];
  setElements: (elements: RefObject<HTMLElement | null>[]) => void;
}

export const TabContext = createContext<TabContextType | undefined>(undefined);
export const ElementContext = createContext<ElementContextType | undefined>(
  undefined,
);

export function useTabContext() {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error("useTabContext must be used inside TabProvider");
  return ctx;
}

export function useElementContext() {
  const ctx = useContext(ElementContext);
  if (!ctx)
    throw new Error("useElementContext must be used inside TabProvider");
  return ctx;
}
