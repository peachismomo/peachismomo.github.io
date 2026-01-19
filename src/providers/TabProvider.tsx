import { type RefObject, useState } from "react";
import React from "react";
import { TabContext, ElementContext } from "../context/useTabContext";

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [elements, setElements] = useState<RefObject<HTMLElement | null>[]>([]);
  const [suppressObserver, setSuppressObserver] = useState<boolean>(false);

  return (
    <TabContext.Provider
      value={{
        currentIndex: currentTab,
        setCurrentIndex: setCurrentTab,
        suppressObserver: suppressObserver,
        setSuppressObserver: setSuppressObserver,
      }}
    >
      <ElementContext.Provider value={{ elements, setElements }}>
        {children}
      </ElementContext.Provider>
    </TabContext.Provider>
  );
};

export default TabProvider;
