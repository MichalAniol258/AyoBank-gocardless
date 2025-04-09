"use client"
import { createContext, useState, ReactNode, useContext } from 'react';


interface AccountsContextType {
    accounts: string | null;
    setAccounts: (id: string) => void
}

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider = ({ children }: { children: ReactNode }) => {
    const [accounts, setAccounts] = useState<string | null>(null)

    return (
        <AccountsContext.Provider value={({ accounts, setAccounts })}>
            {children}
        </AccountsContext.Provider>
    )
}

export const useAccountsContext = () => {
    const context = useContext(AccountsContext);
    if (context === undefined) {
        throw new Error('useRequisitionContext must be used within a RequisitionProvider');
    }
    return context;
};

