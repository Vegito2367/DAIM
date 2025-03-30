import { pinata, secrets } from "@/app/utils/config";
import { type NextRequest, NextResponse } from "next/server";
import { JsonBody } from "pinata";

export interface jsonData{
  title:string;
  description:string
  tags:string
  metrics:string
  cid:string
}
export async function GET(request:NextRequest) {

  try {
    const fileListResponse = await pinata.files.public
    .list()
    .keyvalues({
      type:"json"
    })
    const filesList = fileListResponse.files;
    const outputJsonItems:jsonData[]=[]

    await Promise.all(
        filesList.map(async (file) => {
          const jsonFile = await fetch(`https://${secrets.gateway}/ipfs/${file.cid}`);
          const data:jsonData = await jsonFile.json();
          outputJsonItems.push(data);
        })
      );
    
    console.log(outputJsonItems)
    if(!fileListResponse) {
      throw new Error("Content not found");
    }
    return NextResponse.json({response: "content found", payload: outputJsonItems,  status: 200 });
  }
  catch (e) {
    return NextResponse.json(
      { response: e, payload: null },
      { status: 500 }
    );
  }
}
export const runtime = 'edge';