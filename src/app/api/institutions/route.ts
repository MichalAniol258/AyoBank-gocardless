import { NextResponse } from "next/server";
import { getAccessToken, getBanks } from "../../lib/gocardless"

export async function GET() {
    try {
        const tokenId = await getAccessToken()
        const banks = await getBanks(tokenId)

        return NextResponse.json({ tokenId, banks }, { status: 200 })
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        } else {
            return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
        }
    }
}