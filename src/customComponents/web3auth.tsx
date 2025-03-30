'use client';
import { useAccount, useSignMessage } from "wagmi";
import { useState } from "react";
import { ethers } from "ethers";

export default function Web3Auth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [message] = useState("Sign this message to authenticate");

  async function handleSignIn() {
    if (!isConnected || !address) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const signature = await signMessageAsync({ message });

      // Send signature and address to the backend for verification
      const response = await fetch("/api/authentication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, message, signature }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Authenticated successfully!");
      } else {
        alert("Authentication failed.");
      }
    } catch (error) {
      console.error("Signing error:", error);
    }
  }

  return (
    <div>
      {isConnected ? (
        <>
          <p>Connected as: {address}</p>
          <button onClick={handleSignIn}>Sign in with MetaMask</button>
        </>
      ) : (
        <p>Connect your wallet using RainbowKit.</p>
      )}
    </div>
  );
}
