"use client";
import { useEffect, useState } from 'react';
import { useBankContext } from './BankProvider';
import { useRequisitionContext } from './requisitionProvider';
import { setCookie, hasCookie, getCookie } from 'cookies-next/client';
interface Bank {
    id: string;
    name: string;
    logo: string;
}

interface ApiResponse {
    banks: Bank[];
    tokenId: string;
}

interface RedirectResponse {
    redirectUrl: string;
    requisitionId: string;
}

interface Balance {
    balanceAmount: {
        amount: string;
        currency: string;
    };
    balanceType: string;
}

interface Transactions {
    debtorName: string;
    transactionAmount: {
        currency: string;
        amount: string
    }
    bookingDate: string;
    remittanceInformationUnstructured: string
}

export default function BankList() {
    const [banks, setBanks] = useState<Bank[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { setSelectedBankId, selectedBankId } = useBankContext();
    const { requisitionId, setRequisitionId, accounts, setAccounts, setTokenId } = useRequisitionContext();
    const [balances] = useState<Balance[]>([]);
    const [transactions] = useState<Transactions[]>([]);

    useEffect(() => {
        async function fetchBanks() {
            const storedRequisitionId = hasCookie('requisitionId');
            if (!storedRequisitionId) {
                try {
                    const response = await fetch('/api/institutions');
                    const rawData: ApiResponse = await response.json();
                    console.log('Raw Data:', rawData);
                    const expires = new Date();
                    expires.setFullYear(expires.getFullYear() + 1); // 100 lat


                    setCookie('tokenId', rawData.tokenId, {
                        expires,
                        sameSite: 'lax'
                    });
                    setTokenId(rawData.tokenId);
                    setBanks(rawData.banks);
                } catch (error) {
                    if (error instanceof Error) {
                        setError(error.message);
                    } else {
                        setError('Unknown error occurred');
                    }
                }
            }
        }

        fetchBanks();
    }, []);

    const handleBankClick = (id: string) => {
        setSelectedBankId(id);
        console.log(`Selected Bank ID: ${id}`);
    };

    useEffect(() => {
        async function fetchRequisition() {
            const storedTokenId = hasCookie('tokenId');
            const getTokenId = getCookie('tokenId');
            if (selectedBankId && storedTokenId) {
                try {
                    console.log(`Fetching requisition for Bank ID: ${selectedBankId}`);
                    const response = await fetch(`/api/requisition?tokenId=${getTokenId}&bankId=${selectedBankId}`);
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    const rawData: RedirectResponse = await response.json();
                    console.log('API Response:', rawData);
                    if (rawData && rawData.redirectUrl && rawData.requisitionId) {
                        console.log('Redirecting to URL:', rawData.redirectUrl);
                        setRequisitionId(rawData.requisitionId); // Save requisition ID to context
                        const expires = new Date();
                        expires.setFullYear(expires.getFullYear() + 1);
                        setCookie('requisitionId', rawData.requisitionId, { sameSite: 'lax', expires });
                        window.location.href = rawData.redirectUrl; // Redirect to the URL
                    } else {
                        throw new Error('Redirect URL or Requisition ID is missing in the response');
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        setError(error.message);
                        console.error('Error in fetchRequisition:', error);
                    } else {
                        setError('Unknown error occurred');
                    }
                }
            }
        }

        fetchRequisition();
    }, [selectedBankId]);

    useEffect(() => {
        async function fetchAccounts() {
            const storedRequisitionId = hasCookie('requisitionId');
            const storedTokenId = hasCookie('tokenId');
            const getTokenId = getCookie('tokenId');
            const getRequisitionId = getCookie('requisitionId');
            if (storedRequisitionId && storedTokenId) {
                try {
                    const response = await fetch(`/api/accounts?tokenId=${getTokenId}&requisitionId=${getRequisitionId}`);
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    const accountIds = await response.json();
                    console.log('Account IDs:', accountIds[0]);
                    setAccounts(accountIds);
                } catch (error) {
                    if (error instanceof Error) {
                        setError(error.message);
                        console.error('Error in fetchAccounts:', error);
                    } else {
                        setError('Unknown error occurred');
                    }
                }
            }
        }

        fetchAccounts();
    }, [requisitionId]);




    if (error) {
        return <div>Error: {error}</div>;
    }

    if (accounts && accounts.length > 0) {
        return (
            <div>
                <h1>Your Accounts</h1>
                {balances.slice(0, 1).map((bal, index) => (
                    <div key={index}>
                        <p>Balance: {bal.balanceAmount.amount} {bal.balanceAmount.currency}</p>
                    </div>
                ))}

                {transactions.map((tran, index) => (
                    <div key={index}>
                        <p>debtorName: {tran.debtorName}</p>
                        <p>transaction Amount: {tran.transactionAmount.amount} {tran.transactionAmount.currency}</p>
                        <p>booking date: {tran.bookingDate}</p>
                    </div>
                ))}
            </div>
        );
    }

    if (!banks) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Select your bank</h1>
            {banks.map((bank) => (
                <div key={bank.id} onClick={() => handleBankClick(bank.id)} style={{ cursor: 'pointer' }}>
                    <img src={bank.logo} alt={bank.name} />
                    <p>{bank.name}</p>
                </div>
            ))}
        </div>
    );
}
