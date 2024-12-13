"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PartyPopper, Compass, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import HeaderUser from "./HeaderUser";
import { useState } from "react";
import { Button } from "../ui/button";
import { SignInForm } from "../dialogs/SignInDialog";
import { SignUpForm } from "../dialogs/SignUpDialog";

export default function Header() {
  const pathname = usePathname();
  const user = true;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [authLoading, setAuthLoading] = useState(false);

  const navLinks = [
    {
      href: "/events",
      icon: PartyPopper,
      label: "Events",
      isActive: pathname === "/events",
    },
    {
      href: "/explore",
      icon: Compass,
      label: "Explore",
      isActive: pathname === "/explore",
    },
    {
      href: "/create",
      icon: Plus,
      label: "Create Event",
      isActive: pathname === "/create",
    },
  ];

  const handleSignIn = async (email: string) => {
    setAuthLoading(true);
    try {
      // Implement your sign in logic here
      console.log("Signing in with email:", email);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string
  ) => {
    setAuthLoading(true);
    try {
      // Implement your sign up logic here
      console.log("Signing up with:", { email, password, name });
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSwitchToSignUp = () => {
    setAuthMode("signup");
  };

  const handleSwitchToSignIn = () => {
    setAuthMode("signin");
  };

  return (
    <header
      className={cn(
        "fixed top-0 pt-2 z-50 w-full bg-gradient-to-b from-[#82cbf6] to-[#ebf8ff]"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-colors hover:opacity-75"
          >
            <Image
              src="/Xeno.svg"
              alt="Xeno Events"
              width={80}
              height={60}
              priority
              draggable={false}
            />
          </Link>
        </div>

        {/* Desktop navigation - centered with gaps */}
        {user && (
          <div className="hidden sm:flex items-center justify-center flex-1 mx-auto">
            <div className="flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
              {navLinks.map(({ href, icon: Icon, label, isActive }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-black ${
                    isActive ? "text-black" : "text-gray-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          {!user ? (
            <div>
              <Button
                className="rounded-full bg-blue-600 h-[34px] w-20 text-sm font-semibold transition-colors hover:bg-blue-700 md:px-6 md:py-2.5"
                variant="default"
                onClick={() => {
                  setIsDialogOpen(true);
                  setAuthMode("signup");
                }}
              >
                Sign Up
              </Button>
              <SignInForm
                open={isDialogOpen && authMode === "signin"}
                onOpenChange={setIsDialogOpen}
                onSignIn={handleSignIn}
                onSwitchToSignUp={handleSwitchToSignUp}
                isLoading={authLoading}
              />
              <SignUpForm
                open={isDialogOpen && authMode === "signup"}
                onOpenChange={setIsDialogOpen}
                onSignUp={handleSignUp}
                onSwitchToSignIn={handleSwitchToSignIn}
                isLoading={authLoading}
              />
            </div>
          ) : (
            <HeaderUser navLinks={navLinks} />
          )}
        </div>
      </div>
    </header>
  );
}
