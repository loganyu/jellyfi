import { NextRequest, NextResponse } from "next/server";
// import mockResponse from "./mock_response"

export async function GET(request: NextRequest) {
    // return NextResponse.json(mockResponse);

    const lender = request.nextUrl.searchParams.get("lender") as string
    const response = await fetch('https:///api.lenderlabs.xyz/api/get_lender_loans?' + new URLSearchParams(
        { lender }
    ));
    const data = await response.json();
    return NextResponse.json(data)
}

