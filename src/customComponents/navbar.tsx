import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-evenly items-center">
        {/* Logo */}
        <a href="/" className="text-xl font-bold">DAIM</a>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-gray-300">Explore</a>
          <a href="/profile" className="hover:text-gray-300">Profile</a>
        </div>
      </div>
    </nav>
  );
}
