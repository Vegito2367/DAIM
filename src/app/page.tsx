'use client'
import { useState } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Web3Auth from "@/customComponents/web3auth";
import Navbar from "@/customComponents/navbar";
import ListingHolder from "@/customComponents/listingHolder";
import { useEffect } from "react";
import CodeHolder from "@/customComponents/codeHolder";
import { Button } from "@/components/ui/button";
import { GoogleGenAI } from "@google/genai";
import AIChatbox from "@/customComponents/chatbox";

export interface jsonData{
  title:string;
  description:string
  tags:string
  metrics:string
  cid:string
}

export interface codeHolderProps {
  code: string;
  handleSheetClose: () => void;
}

export interface ListingProps {
  title: string;
  description: string;
  category: string[];
  metrics: KPI[];
  cid: string;
}

export interface ListingComponentProps extends ListingProps {
  handleCode: (cid: string) => void;
}

export interface KPI {
  property: string;
  value: string;
}




export default function Home() {
  const { address, isConnected } = useAccount();
  const [listingHolder, setListingHolder] = useState<ListingProps[]>([]);
  const [showSheet,setshowSheet] = useState(false);
  const [code,setCode] = useState<string>();
  const [showGemini, setShowGemini] = useState(false);
  const gemini = new GoogleGenAI({apiKey : `${process.env.GEMINI_API_KEY}`})



  
  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await fetch("/api/listFile", {
          method: "GET",
        });
        const data = await response.json();
        const jsonList: jsonData[] = data.payload;
        console.log(jsonList)
        if (data.status === 200) {
          jsonList.map((list, index) => {
            const categories: string[] = list.tags.split(",")
            const metricPairs: string[] = list.metrics.split(",");
            const metric: KPI[] = [];
            metricPairs.map((met, index) => {
              const pair = met.split(":")
              metric.push({
                property: pair[0],
                value: pair[1]
              })
            })

            setListingHolder(prevHolder => [...prevHolder, {
              title: list.title,
              description: list.description,
              category: categories,
              metrics: metric,
              cid: list.cid
            }])
          })
        }
      }
      catch (e) {
        console.log(e)
        console.log("Error Happened")
      }

    }
    fetchFiles();
  }, []);


  async function getCIDfromChild (cid: string) {
    console.log("CID from child:", cid);
    try {
      const response = await fetch(`/api/getCode?fetchCID=${cid}`)
      const data = await response.json();
      const payload:string = data.payload;
      setshowSheet(true)
      setCode(payload)
      
    }
    catch (e) {
      console.log(e)
    }
  }

  function handleSheetClose() {
    setshowSheet(false)
  }

  async function handleGemini (message: string) {
  }

  return (
    <div>
      <Navbar/>
    <Button onClick={()=> setShowGemini(!showGemini)}>Toggle Gemini</Button>
    <div className="flex flex-row max-h-full">
    <div className="flex flex-row h-screen w-full overflow-y-scroll">
   <div className="w-full py-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-sm">
  {listingHolder
    .sort((a, b) => a.title.length - b.title.length)
    .map((list, index) => {
      return (
        <ListingHolder
          title={list.title}
          description={list.description}
          category={list.category}
          metrics={list.metrics}
          cid={list.cid}
          handleCode={getCIDfromChild}
          key={index}
        />
      );
    })}
</div>
{showGemini && (
  <div className="w-6/12">
  <AIChatbox />
</div>
)}

</div>
{showSheet && (
  <div className="w-1/3">
    <CodeHolder code={code!} handleSheetClose={handleSheetClose}/>
    </div>  
    )}
</div>

    </div>
  )
}