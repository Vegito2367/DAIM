import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="bg-white text-gray-800 p-4 shadow-sm sticky top-0 z-20 border-b mb-4 border-blue-600">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-xl font-medium flex items-center">
          <span className="text-blue-600 font-bold mr-1">D</span>
          <span>AIM</span>
        </a>
        

        <div className="hidden md:flex items-center space-x-6">
          <a 
            href="/" 
            className="py-2 px-3 rounded-md shadow-md shadow-blue-400 hover:shadow-blue-600 hover:shadow-lg transition-all duration-200 font-medium"
          >
            Explore
          </a>
          <a 
            href="/profile" 
            className="py-2 px-3 rounded-md shadow-md shadow-blue-400 hover:shadow-blue-600 hover:bg-gray-50 hover:shadow-lg transition-all duration-200 font-medium"
          >
            Profile
          </a>
        </div>
        
      </div>
    </nav>
  );
}