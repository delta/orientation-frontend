import React, { createContext, useContext, useState } from 'react';

type AllowedPortals = 'minigame/2048' | 'hello-world';

interface IPortalContext {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentMethod: AllowedPortals | null;
    setCurrentMethod: React.Dispatch<
        React.SetStateAction<AllowedPortals | null>
    >;
}

export const PortalContext = createContext<IPortalContext | null>(null);

export const PortalContextProvider: React.FC = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [currentMethod, setCurrentMethod] = useState<AllowedPortals | null>(
        null
    );

    return (
        <PortalContext.Provider
            value={{ open, setOpen, currentMethod, setCurrentMethod }}
        >
            {children}
        </PortalContext.Provider>
    );
};

export const usePortal = () => {
    return useContext(PortalContext);
};
