// components/Header.jsx
import Link from "next/link";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full py-3 px-4 bg-white/90 backdrop-blur-sm shadow-sm fixed top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <Image 
              src="/nurse-logo.png" 
              alt="Build4Nurse Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-blue-600">Build4Nurse</span>
        </Link>
        
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem className="px-2">
              <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="px-2">
              <Link href="#" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                About
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem className="px-2">
              <Link href="#" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                Help
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}