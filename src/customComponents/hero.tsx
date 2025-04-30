"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // fixed import typo

export default function Hero() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative bg-white overflow-hidden flex justify-center items-center min-h-[80vh]"
    >
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-600 opacity-5 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-20 pb-24 z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Heading and Description */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              <span className="block">Decentralized</span>
              <span className="block text-blue-600">AI Marketplace</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover, trade, and leverage AI models in a secure, decentralized ecosystem. Connect your wallet to buy or sell AI solutions today.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => router.push("/listingPage")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-md transition duration-300 shadow-md hover:shadow-lg"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/learn")}
              className="border border-blue-400 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg rounded-md transition duration-300 shadow-sm hover:shadow-md"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Wave Bottom Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="#f9fafb"
            d="M0,96L80,85.3C160,75,320,53,480,48C640,43,800,53,960,58.7C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </div>
    </motion.div>
  );
}
