'use client'
import { useState } from "react";
import { useAccount } from "wagmi";
import Navbar from "@/customComponents/navbar";
import ListingHolder from "@/customComponents/listingHolder";
import { useEffect } from "react";
import CodeHolder from "@/customComponents/codeHolder";
import { Button } from "@/components/ui/button";
import CodeListing from "../listingCode/page";
import AIChatbox from "@/customComponents/chatbox";
import { useRouter } from "next/navigation";
export interface jsonData {
  title: string;
  description: string
  tags: string
  metrics: string
  cid: string
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
  handleCode: (cid: string, title: string) => void;
}

export interface KPI {
  property: string;
  value: string;
}




export default function Home() {
  const { address, isConnected } = useAccount();
  const [listingHolder, setListingHolder] = useState<ListingProps[]>([]);
  const [showSheet, setshowSheet] = useState(false);
  const [code, setCode] = useState<string>();
  const router = useRouter();
  const [title, setTitle] = useState<string>("")




  useEffect(() => {
    async function fetchFiles() {
      setListingHolder([])
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


  async function getCIDfromChild(cid: string, title: string) {
    console.log("CID from child:", cid);
    try {
      const response = await fetch(`/api/getCode?fetchCID=${cid}`)
      const data = await response.json();
      const payload: string = data.payload;
      setshowSheet(true)
      setCode(payload)
      console.log(title)
      setTitle(title)


    }
    catch (e) {
      console.log(e)
    }
  }

  function handleSheetClose() {
    setshowSheet(false)
    setCode("")
  }


  if (showSheet) {
    return (
      <CodeListing
        code={code!}
        title={title}
        handleSheetClose={handleSheetClose}
      />
    )
  }
  else {
    return (
      <div>
        <>
          <Navbar />
          {/* Header */}
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-800 dark:text-white transition-colors duration-300">
              Discover Listings
            </h1>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 max-w-md">
              Explore community-submitted code snippets and smart solutions
            </p>
          </div>


          {/* Main content: listings + optional panels */}
          <div className="flex h-[calc(100vh-4rem)]">
            {/* Listings & AI Chatbox */}
            <div className="flex-1 flex flex-col px-2">
              {/* Grid of listings */}
              <div
                className=" auto-rows-fr grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-sm px-4"
              >

                {listingHolder
                  .sort((a, b) => a.title.length - b.title.length)
                  .map((list, index) => (
                    <ListingHolder
                      key={index}
                      title={list.title}
                      description={list.description}
                      category={list.category}
                      metrics={list.metrics}
                      cid={list.cid}
                      handleCode={getCIDfromChild}
                    />
                  ))}
              </div>
            </div>
          </div>
        </>
      </div>
    )
  }
}