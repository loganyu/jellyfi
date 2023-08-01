import { NextRequest, NextResponse } from "next/server";
// import mockResponse from "./mock_response"

const { RestClient, NftLoanSummaryRequest } = require("@hellomoon/api");

const client = new RestClient(process.env['HELLOMOON_BEARER_TOKEN']);

export async function GET(request: NextRequest) {
    // return NextResponse.json(mockResponse);

    const lender = request.nextUrl.searchParams.get("lender") as string
    const response = await client.send(new NftLoanSummaryRequest({
        lender
    }))
    return NextResponse.json(response)
}
