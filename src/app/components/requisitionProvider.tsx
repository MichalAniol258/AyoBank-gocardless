"use client"
import { createContext, useState, ReactNode, useContext } from 'react';


interface RequisitionContextType {
    requisitionId: string | null;
    setRequisitionId: (id: string) => void;
    accounts: string | null;
    setAccounts: (id: string) => void
    tokenId: string | null;
    setTokenId: (id: string) => void;
}

const RequisitionContext = createContext<RequisitionContextType | undefined>(undefined);

export const RequisitionProvider = ({ children }: { children: ReactNode }) => {
    const [requisitionId, setRequisitionId] = useState<string | null>(null);
    const [accounts, setAccounts] = useState<string | null>(null)
    const [tokenId, setTokenId] = useState<string | null>(null)

    return (
        <RequisitionContext.Provider value={{ requisitionId, setRequisitionId, accounts, setAccounts, tokenId, setTokenId }}>
            {children}
        </RequisitionContext.Provider>
    );
};

export const useRequisitionContext = () => {
    const context = useContext(RequisitionContext);
    if (context === undefined) {
        throw new Error('useRequisitionContext must be used within a RequisitionProvider');
    }
    return context;
};
