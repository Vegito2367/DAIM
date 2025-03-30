import Image from "next/image";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Web3Auth from "@/customComponents/web3auth";

export default function Home() {
  
  //Wallet connection.
  return (
    <div>
      <ConnectButton />
      <Web3Auth />
    </div>
  )
}