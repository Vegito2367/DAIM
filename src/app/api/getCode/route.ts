import { pinata, secrets } from "@/app/utils/config";
import { type NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest) {
    const url = new URL(request.url)
    const cid = url.searchParams.get("fetchCID") as string
   
  try{
      const response = await fetch(`https://${secrets.gateway}/ipfs/${cid}`);
      const payload= await response.text();
      console.log(payload)
      return NextResponse.json({response:"Succeded Messgae", payload: payload, status: 200})
    }
  catch (e) {
    console.log(e)
    return NextResponse.json(
      { response: e, payload: null },
      { status: 500 }
    );
  }
}
export const runtime = 'edge';