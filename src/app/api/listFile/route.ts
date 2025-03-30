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
    const fileListResponse = await pinata.files.private
    .list()
    .keyvalues({
      type:"json"
    })
    const filesList = fileListResponse.files;
    const urls:string[] = [];
    const outputJsonItems:jsonData[]=[]

    await Promise.all(
        filesList.map(async (file) => {
          const nowUrl = await pinata.gateways.private.createAccessLink({
            cid: file.cid,
            expires: 60*5
          })
            urls.push(nowUrl);
        })
      );

    await Promise.all(
      urls.map(async (url) => {
        const jsonFile= await fetch(url);
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