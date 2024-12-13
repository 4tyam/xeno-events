"use client";

import { useState, useRef, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavLink {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

interface HeaderUserProps {
  navLinks: NavLink[];
}

export default function HeaderUser({ navLinks }: HeaderUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      label: "Settings",

      onClick: () => router.push("/settings"),
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
      >
        <Image
          src="/image-placeholder.jpeg"
          alt="User Avatar"
          width={32}
          height={32}
          className="sm:w-9 sm:h-9 rounded-full aspect-square object-cover"
          draggable={false}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 sm:w-72 rounded-lg shadow-lg bg-white ring-1 ring-black/5">
          {/* Profile Section */}
          <div className="p-3 sm:p-4 border-b border-gray-100">
            <div className="flex items-center gap-3 sm:gap-4">
              <Image
                src="/image-placeholder.jpeg"
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full aspect-square object-cover"
                draggable={false}
              />
              <div className="flex-1">
                <h3 className="font-medium text-sm sm:text-base">
                  Aditya Atyam
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  atyam@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="sm:hidden border-b border-gray-100">
            <div className="grid grid-cols-3 gap-2 p-2">
              {navLinks.map(({ href, icon: Icon, label, isActive }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-col items-center justify-center rounded-md p-1 text-center transition-colors hover:bg-gray-100 ${
                    isActive ? "text-blue-500" : "text-black"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-4 w-4 mb-0.5" />
                  <span className="text-xs w-full">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1" role="menu">
            {menuItems.map((item, index) => (
              <div key={index} className="px-1">
                <button
                  onClick={item.onClick}
                  className="w-full flex items-center px-2 py-1.5 text-xs sm:text-sm hover:bg-gray-100 rounded-md"
                  role="menuitem"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{item.label}</span>
                  </div>
                </button>
              </div>
            ))}

            <div className="px-1">
              <button
                onClick={() => console.log("Logout clicked")}
                className="w-full flex items-center px-2 py-1.5 text-xs sm:text-sm hover:bg-gray-100 rounded-md"
                role="menuitem"
              >
                <div>
                  <span className="text-muted-foreground">Logout</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
