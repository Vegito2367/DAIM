import { NextRequest,NextResponse } from "next/server";
import { ethers } from "ethers";

export async function POST(req: NextRequest) {

    const { address, message, signature } = await req.json();
  
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      return NextResponse.json({ success: true, message: "Authenticated", status: 200 });
    } else {
        return NextResponse.json({ success: false, message: "Failed", status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error", status: 500 });
  }
}

export async function GET (req:NextRequest){
    
}
