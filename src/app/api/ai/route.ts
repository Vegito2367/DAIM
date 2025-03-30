import { GoogleGenAI } from "@google/genai";
import { stat } from "fs";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request:NextRequest){
    try{

    
    const gemini = new GoogleGenAI({apiKey : process.env.GEMINI_API_KEY})
    const data = await request.json();
    const prompt = data.prompt as string;
    if(prompt == null){
        return NextResponse.json({error:"No prompt provided", status:400})
    }
    const response = await gemini.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Answer exactly as I dictate now. Do not add anything else. You're response will be split into two parts. The first part will
        be relevant text to the prompt. The second part will be all the code you generated, if applicable. The two parts must be separated by $%$% such that I can split the
        response into two parts based on that sequence of symbols. If you think you're response has no code component, put 'No code' after the $%$% symbol. The prompt is as follows:
        ${prompt}`,
    })
    const aiMessage = response.text as string;
    const splits = aiMessage.split("$%$%")

    return NextResponse.json({message:splits[0].trim(),codeResponse: splits[1].trim(), status:200})
    }
    catch(e){
        console.log(e)
        return NextResponse.json({error:"Error in AI response", status: 500})
    }
}