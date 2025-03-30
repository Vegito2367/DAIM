import { pinata, secrets,api } from "@/app/utils/config";
import { type NextRequest, NextResponse } from "next/server";
import { title } from "process";


export async function POST(request:NextRequest) {
    const data = await request.formData();
    const file: File = data.get("file") as File;
    const ititle: string = data.get("title") as string;
    const idescription: string = data.get("description") as string;
    const itags: string = data.get("tags") as string;
    const imetrics: string = data.get("metrics") as string;
    const iAddress:string = data.get("address") as string;
    if (!file) {
        return NextResponse.json(
            { response: "No file provided", payload: null },
            { status: 400 }
        );
    }

   
  try{
        console.log("Entered POST request auto drive")
        // const cid = api.uploadFileFromInput(file, {
        //     compression: false,
        //   })
        //   .then(res => {
        //     console.log("Upload successful:", res.);
        //     return res; // Important: return the value for the next .then() or assignment
        //   })
        //   .catch(err => {
        //     console.error("File upload failed:", err);
        //     // More detailed error handling here
        //     if (err.message.includes("Internal Server Error")) {
        //       console.error("Server is experiencing issues. Please try again later.");
        //     }
        //     // Rethrow or handle as needed
        //     throw err;
        //   });

    //   console.log("CID:", cid);
    //     const jsonBody = {
    //         title: ititle,
    //         description: idescription,
    //         tags: itags,
    //         metrics: imetrics,
    //         cid: cid
    //     }
        // const jsonCID = await api.uploadObjectAsJSON(jsonBody,`$json-${ititle.split(" ")[0]}.json`)
        //console.log("Upload response:", jsonBody);
      return NextResponse.json({response:"Succeded Messgae", status: 200})
    }
  catch (e) {
    console.log(e)
    return NextResponse.json(
      { response: e, payload: null },
      { status: 500 }
    );
  }
}