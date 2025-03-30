import { pinata, secrets } from "@/app/utils/config";
import { type NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest) {
    const url = new URL(request.url)
    const cid = url.searchParams.get("fetchCID") as string
    const accessURL = await pinata.gateways.private.createAccessLink({
        cid: cid,
        expires: 60*5
    })
  try{
      const response = await fetch(accessURL);
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