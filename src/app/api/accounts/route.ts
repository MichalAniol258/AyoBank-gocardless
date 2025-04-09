import { NextRequest, NextResponse } from "next/server";
import {  listAccounts } from "../../lib/gocardless";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const requisitionId = searchParams.get('requisitionId');
    const tokenId = searchParams.get('tokenId');

    if (!requisitionId) {
        return NextResponse.json({ error: 'Requisition ID is required' }, { status: 400 });
    }

    if (!tokenId) {
        return NextResponse.json({ error: 'Token ID is required' }, { status: 400 });
    }

    try {
        const accountsResponse = await listAccounts(tokenId, requisitionId);
        console.log(`Fetched Accounts Response: ${JSON.stringify(accountsResponse)}`);

        const accounts = accountsResponse.accounts || [];
        return NextResponse.json(accounts, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching accounts:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
        }
    }
}
