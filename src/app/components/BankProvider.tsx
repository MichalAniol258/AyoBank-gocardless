"use client"
import { createContext, useState, ReactNode, useContext } from 'react';

interface BankContextType {
    selectedBankId: string;
    setSelectedBankId: (id: string) => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider = ({ children }: { children: ReactNode }) => {
    const [selectedBankId, setSelectedBankId] = useState<string>('');

    return (
        <BankContext.Provider value={{ selectedBankId, setSelectedBankId }}>
            {children}
        </BankContext.Provider>
    );
};

export const useBankContext = () => {
    const context = useContext(BankContext);
    if (context === undefined) {
        throw new Error('useBankContext must be used within a BankProvider');
    }
    return context;
};
