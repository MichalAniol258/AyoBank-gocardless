import axios from 'axios';

const getAccessToken = async () => {
    const response = await axios.post(
        'https://bankaccountdata.gocardless.com/api/v2/token/new/',
        {
            secret_id: process.env.GC_SECRET_ID,
            secret_key: process.env.GC_SECRET_KEY,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
        }
    );

    return response.data.access;
};



const getBanks = async (accessToken: string) => {
    const response = await axios.get(
        'https://bankaccountdata.gocardless.com/api/v2/institutions/?country=PL', // Zmien kraj na odpowiedni kod
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'accept': 'application/json',
            },
        }
    );

    return response.data;
};



export { getAccessToken, getBanks };

const createEndUserAgreement = async (accessToken: string, institution_id: string) => {
    try {
        const response = await axios.post(
            'https://bankaccountdata.gocardless.com/api/v2/agreements/enduser/',
            {
                institution_id: institution_id,
                max_historical_days: 90,
                access_valid_for_days: 90,
                access_scope: ['balances', 'details', 'transactions']
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
            }
        );

        console.log('End User Agreement Response:', response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating end user agreement:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || error.message);
        } else {
            console.error('Unexpected error:', error);
            throw new Error('An unexpected error occurred');
        }
    }
};
export { createEndUserAgreement };


const createRequisition = async (accessToken: string, institutionId: string, redirectUrl: string, agreementId: string) => {
    try {
        const response = await axios.post(
            'https://bankaccountdata.gocardless.com/api/v2/requisitions/',
            {
                redirect: redirectUrl,
                institution_id: institutionId,
                agreement: agreementId,
                user_language: 'EN'
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
            }
        );

        console.log('Requisition Response:', response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating end user Requisition:', error.response?.data || error.message);
            throw new Error(error.response?.data?.error || error.message);
        } else {
            console.error('Unexpected error:', error);
            throw new Error('An unexpected error occurred');
        }
    }
};
export { createRequisition };

const listAccounts = async (accessToken: string, requisitionId: string) => {
    const response = await axios.get(
        `https://bankaccountdata.gocardless.com/api/v2/requisitions/${requisitionId}/`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'accept': 'application/json',
            },
        }
    );

    return response.data;
};

export { listAccounts };


const getTransactions = async (accessToken: string, accountId: string) => {
    const response = await axios.get(
        `https://bankaccountdata.gocardless.com/api/v2/accounts/${accountId}/transactions/`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'accept': 'application/json',
            },
        }
    );

    return response.data;
};

const getBalance = async (accessToken: string, accountId: string) => {
    const response = await axios.get(
        `https://bankaccountdata.gocardless.com/api/v2/accounts/${accountId}/balances/`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'accept': 'application/json'
            },
        }
    );

    return response.data
}

const getDetails = async (accessToken: string, accountId: string) => {
    const response = await axios.get(
        `https://bankaccountdata.gocardless.com/api/v2/accounts/${accountId}/details/`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'accept': 'application/json'
            },
        }
    );

    return response.data
}

export { getTransactions, getBalance, getDetails };