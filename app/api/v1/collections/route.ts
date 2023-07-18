import { NextRequest, NextResponse } from "next/server";
// import mockResponse from "./mock_response"

export async function GET(request: NextRequest) {
    // return NextResponse.json(mockResponse);

    const collectionIds = request.nextUrl.searchParams.get("collectionIds")?.split(',') as string[];

    const responses = await Promise.all(collectionIds.map(collection_id => fetch('https://api.lenderlabs.xyz/api/get_collection?' + new URLSearchParams(
        { collection_id }
    ))));
    const data = await Promise.all(responses.map(response => response.json()));
    const collections = data.map(d => d.collection)
    collections.forEach((c, i) => {
        // delete c.loans
        // delete c.offers
        c.id = collectionIds[i]
    })

    return NextResponse.json(collections);
}

