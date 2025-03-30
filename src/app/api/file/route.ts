import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/app/utils/config"

export async function POST(request: NextRequest) {
    console.log("Entered post request")
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const ititle: string = data.get("title") as string;
    const idescription: string = data.get("description") as string;
    const itags: string = data.get("tags") as string;
    const imetrics: string = data.get("metrics") as string;
    const iAddress:string = data.get("address") as string;
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }
    // const files = await pinata.files.public.list()
    // .keyvalues({
    //     type:"code",
    //     userAddress:iAddress
    // })
    // if(files.files.length == 0) {
    //     return NextResponse.json(
    //         { response: "File already exists and the current user is not the owner" },
    //         { status: 403 }
    //     );
    // }
    const { cid } = await pinata.upload.public
    .file(file)
    .keyvalues({
      type:"code",
      userAddress:iAddress
    })
    
    const jsonBody = {
      title: ititle,
      description: idescription,
      tags: itags,
      metrics: imetrics,
      cid: cid
    }
    const upload = await pinata.upload.public
    .json(jsonBody)
    .name(`${ititle}.json`)
    .keyvalues({
      type:"json",
      userAddress:iAddress
    });
    console.log("Upload response:", upload);
    return NextResponse.json({ status: 200 });
  } catch (e) {
    console.log("Erorr in post request")
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request:NextRequest) {
  const url = new URL(request.url);
  const cid = url.searchParams.get("cid");
  if (!cid) {
    return NextResponse.json(
      { error: "No CID provided" },
      { status: 400 }
    );
  }
  try {
    const files = await pinata.files.public
    .list()
    .cid(cid)
    console.log(files);
    if(!files) {
      throw new Error("Content not found");
    }
    return NextResponse.json({response: "content found", payload: files,  status: 200 });
  }
  catch (e) {
    return NextResponse.json(
      { response: e, payload: null },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';