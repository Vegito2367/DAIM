import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function Hero() {
    const router = useRouter();
  return (
    <div className="relative overflow-hidden bg-white justify-center flex flex-row">
      {/* Abstract Background Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-600 opacity-5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 pt-20 pb-24">
        <div className=" gap-12 items-center ">
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                <span className="inline-block">Decentralized</span>{" "}
                <span className="inline-block text-blue-600">AI Marketplace</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                Discover, trade, and leverage AI models in a secure decentralized ecosystem. Connect your wallet to start buying or selling AI solutions today.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={()=>{router.push("/profile")}} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-md transition-all duration-200 shadow-lg hover:shadow-xl hover:translate-y-px">
                Get Started
              </Button>
              <Button className="bg-white shadow-md shadow-blue-400 hover:shadow-blue-600 hover:bg-white hover:shadow-lg text-gray-800 px-8 py-3 text-lg rounded-md transition-all duration-200">
                Learn More
              </Button>
            </div>
            
          </div>
          
          {/* Visual Element */}
          
        </div>
      </div>
      
      {/* Wave Separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
          <path fill="#f9fafb" d="M0,96L80,85.3C160,75,320,53,480,48C640,43,800,53,960,58.7C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  );
}