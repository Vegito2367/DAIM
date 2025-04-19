'use client'
import { useState } from "react";
import Navbar from "@/customComponents/navbar";
import { Button } from "@/components/ui/button";
import Hero from "@/customComponents/hero";

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
  handleCode: (cid: string,tight:string) => void;
}

export interface KPI {
  property: string;
  value: string;
}




export default function Home() {
  
  return (
    <div>
      <Navbar />
      <Hero />
    </div>
  )
}