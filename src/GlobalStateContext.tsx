import React, { createContext, useState, ReactNode } from "react";

interface State {
  isRPCConnected: boolean;
  RPCConecctionTime: number;
}

interface ContextProps {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

export const GlobalStateContext = createContext<ContextProps | undefined>(
  undefined
);

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<State>({
    isRPCConnected: false,
    RPCConecctionTime: 0,
  });

  return (
    <GlobalStateContext.Provider value={{ state, setState }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
