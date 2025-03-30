'use client'
import { useState } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Web3Auth from "@/customComponents/web3auth";
import Navbar from "@/customComponents/navbar";
import ListingHolder from "@/customComponents/listingHolder";

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

const temporaryListings: ListingProps[] = [
  {
    title: "Test Title",
    description: "Test Description",
    category: ["Category1", "Category2"],
    metrics: [
      { property: "Metric1", value: "Value1" },
      { property: "Metric2", value: "Value2" },
    ],
    cid: "Qm...",
  },
  {
    title: "Another Title",
    description: "Another Description",
    category: ["Category3"],
    metrics: [
      { property: "Metric3", value: "Value3" },
      { property: "Metric4", value: "Value4" },
    ],
    cid: "Qm...",
  },
  {
    title: "More Listings",
    description: "More Description",
    category: ["Category4", "Category5"],
    metrics: [
      { property: "Metric5", value: "Value5" },
      { property: "Metric6", value: "Value6" },
    ],
    cid: "Qm...",
  }
];

function getCIDfromChild (cid: string) {
  console.log("CID from child:", cid);
  // Handle the CID as needed
}

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <div>
      <Navbar/>
    <div className="flex flex-row items-center justify-evenly">
    {temporaryListings.sort((a,b)=>a.title.length-b.title.length).map((list, index) => {
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