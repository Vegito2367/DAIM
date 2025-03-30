'use client'
import { useState } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Web3Auth from "@/customComponents/web3auth";
import Navbar from "@/customComponents/navbar";
import ListingHolder from "@/customComponents/listingHolder";
import { useEffect } from "react";

export interface jsonData{
  title:string;
  description:string
  tags:string
  metrics:string
  cid:string
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


  function getCIDfromChild (cid: string) {
    console.log("CID from child:", cid);
    // Handle the CID as needed
  }

  return (
    <div>
      <Navbar/>
    <div className="flex flex-row items-center justify-evenly">
    {listingHolder.sort((a,b)=>a.title.length-b.title.length).map((list, index) => {
        return (

          <ListingHolder title={list.title}
            description={list.description}
            category={list.category}
            metrics={list.metrics}
            cid={list.cid}
            handleCode={getCIDfromChild}
            key={index}
          />

        )
      })}
    </div>
      
    </div>
  )
}