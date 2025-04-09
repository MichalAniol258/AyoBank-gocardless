import { NextRequest, NextResponse } from 'next/server';
import { getBalance } from '../../lib/gocardless';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');
    const tokenId = searchParams.get('tokenId');

    if (!accountId) {
        return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    if (!tokenId) {
        return NextResponse.json({ error: 'Token ID is required' }, { status: 400 });
    }

    try {
        const balance = await getBalance(tokenId, accountId);
        console.log(`Fetched Balance: ${JSON.stringify(balance)}`);

        return NextResponse.json({ balance }, { status: 200 });

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching balance:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            console.error('Unknown error occurred');
            return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
        }
    }
}
