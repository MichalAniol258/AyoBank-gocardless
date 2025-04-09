import { NextRequest, NextResponse } from "next/server";
import { createRequisition, createEndUserAgreement } from "../../lib/gocardless";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const selectedBankId = searchParams.get('bankId');
    const tokenId = searchParams.get('tokenId');

    if (!selectedBankId) {
        return NextResponse.json({ error: 'Bank ID is required' }, { status: 400 });
    }

    if (!tokenId) {
        return NextResponse.json({ error: 'Token ID is required' }, { status: 400 });
    }

    const redirectUrl2 = process.env.URL_WHERE_REDIRECT;

    if (!redirectUrl2) {
        throw new Error("Missing URL_WHERE_REDIRECT environment variable");
    }

    try {
        const agreement = await createEndUserAgreement(tokenId, selectedBankId);
        if (!agreement || !agreement.id) {
            throw new Error("Failed to create End User Agreement");
        }
        const agreementId = agreement.id;
        console.log(`Created Agreement ID: ${agreementId}`);

        const requisition = await createRequisition(tokenId, selectedBankId, redirectUrl2, agreementId);
        console.log(`Created Requisition ID: ${requisition.id}`);

        const redirectUrl = `${requisition.link}`;
        console.log(`Redirect URL: ${redirectUrl}`);


        return NextResponse.json({ redirectUrl, requisitionId: requisition.id }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating requisition:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
        }
    }
}
