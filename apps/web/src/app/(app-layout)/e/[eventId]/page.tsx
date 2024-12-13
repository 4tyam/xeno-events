/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  User,
  ExternalLinkIcon,
  InfoIcon,
  Ticket as TicketIcon,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Separator } from "@/components/ui/separator";
import RegistrationDialog from "@/components/dialogs/RegistrationDialog";

import {
  differenceInMinutes,
  parseISO,
  formatDistanceToNow,
  isWithinInterval,
  subDays,
  format,
} from "date-fns";
import RegistrationInfoDialog from "@/components/dialogs/RegistrationInfoDialog";
import { SignInForm } from "@/components/dialogs/SignInDialog";
import { SignUpForm } from "@/components/dialogs/SignUpDialog";

type EventLocation = {
  placeId: string;
  name: string;
  address: string;
  additionalDetails?: string;
};

type EventData = {
  title: string;
  organizer: string;
  dateTime: {
    start: {
      isoString: string;
    };
    end: {
      isoString: string;
    };
  };
  location: EventLocation;
  isInPerson: boolean;
  createdAt: string;
  description: string;
  website?: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  registration: {
    price: string;
    spotsLeft: number;
    requiresApproval: boolean;
  };
};

const formatDate = (isoString: string) => {
  return format(parseISO(isoString), "EEE, MMMM d");
};

const formatTime = (isoString: string) => {
  return format(parseISO(isoString), "h:mm a");
};

const eventData: EventData = {
  title: "The Ultimate Frisbee Tournament 2024",
  organizer: "Event Organizer Name",
  dateTime: {
    start: {
      isoString: "2025-01-23T14:00:00.000Z",
    },
    end: {
      isoString: "2025-01-23T16:00:00.000Z",
    },
  },
  location: {
    placeId: "ChIJLROGSlmDyzsRPb_Odp5u4MM",
    name: "MIT World Peace University (MIT-WPU)",
    address:
      "Survey No, 124, Paud Rd, Rambaug Colony, Kothrud, Pune, Maharashtra 411038, India",
    additionalDetails: "Enter through the main gate",
  },
  isInPerson: true,
  createdAt: "2024-11-29T10:00:00.000Z",
  description:
    "This is an amazing event that you should not miss. It is a great opportunity to learn and grow. It is a great opportunity to learn and grow. It is a great opportunity to learn and grow. It is a great opportunity to learn and grow. This is an amazing event that you should not miss. It is a great opportunity to learn and grow. It is a great opportunity to learn and grow. It is a great opportunity to learn and grow. It is a great opportunity to learn and grow.",
  website: "https://example.com/event",
  contact: {
    name: "Contact Person Name",
    email: "email@example.com",
    phone: "+1234567890",
  },
  registration: {
    price: "Free",
    spotsLeft: 100,
    requiresApproval: true,
  },
};

export default function EventPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isRegistered] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [authLoading, setAuthLoading] = useState(false);
  const [showRegistrationConfirm, setShowRegistrationConfirm] = useState(false);
  const [showRegistrationInfo, setShowRegistrationInfo] = useState(false);
  const user = true;
  const [isLoading] = useState(false);
  const [isAdmin] = useState(false);
  const [eventStatus, setEventStatus] = useState<
    "upcoming" | "ongoing" | "ended"
  >("upcoming");
  const [endedTimeAgo, setEndedTimeAgo] = useState("");

  useEffect(() => {
    const calculateEventStatus = () => {
      const startDate = parseISO(eventData.dateTime.start.isoString);
      const endDate = parseISO(eventData.dateTime.end.isoString);
      const now = new Date();

      const minutesToEnd = differenceInMinutes(endDate, now);
      const minutesToStart = differenceInMinutes(startDate, now);

      if (minutesToEnd <= 0) {
        setEventStatus("ended");
        setEndedTimeAgo(formatDistanceToNow(endDate, { addSuffix: true }));
      } else if (minutesToStart <= 0) {
        setEventStatus("ongoing");
      } else {
        setEventStatus("upcoming");
      }
    };

    calculateEventStatus();
    const timer = setInterval(calculateEventStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleRegisterClick = () => {
    if (!user) {
      setAuthMode("signup");
      setIsDialogOpen(true);
    } else {
      setShowRegistrationConfirm(true);
    }
  };

  const handleRegistrationConfirm = () => {
    // Handle registration logic here
    console.log("Confirming registration for logged in user");
  };

  const handleSwitchToSignUp = () => {
    setAuthMode("signup");
  };

  const handleSwitchToSignIn = () => {
    setAuthMode("signin");
  };

  const isRecentlyAdded = () => {
    const createdDate = parseISO(eventData.createdAt);
    const lastWeek = subDays(new Date(), 7);

    return isWithinInterval(createdDate, {
      start: lastWeek,
      end: new Date(),
    });
  };

  const handleSignIn = async (email: string) => {
    setAuthLoading(true);
    try {
      // Handle sign in logic here
      console.log("Signing in with:", email);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setAuthLoading(false);
      setIsDialogOpen(false);
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name: string
  ) => {
    setAuthLoading(true);
    try {
      // Handle sign up logic here
      console.log("Signing up with:", { email, password, name });
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setAuthLoading(false);
      setIsDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pb-24 sm:pb-8 sm:-mx-[10rem] px-3 sm:px-0">
        {/* Hero Image Skeleton */}
        <div className="relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden shadow-lg mb-8">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Mobile Tickets Skeleton - Fixed at bottom */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-24 mt-1" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Badges and Title */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          {/* Main Content */}
          <div className="flex-[2]">
            <div className="bg-white rounded-xl p-4 sm:p-8 space-y-8 shadow-sm">
              {/* Date and Time */}
              <div className="space-y-6">
                <div className="flex gap-4 sm:gap-6 items-start">
                  <Skeleton className="w-6 h-6" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-24" />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Skeleton className="h-8 w-40" />
                      <Skeleton className="h-8 w-40" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-6 items-start">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-24" />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Skeleton className="h-8 w-40" />
                      <Skeleton className="h-8 w-40" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-6 items-start">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-24" />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Skeleton className="h-8 w-40" />
                      <Skeleton className="h-8 w-40" />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex gap-4 sm:gap-6 items-start">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden sm:block flex-1">
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 sm:pb-8 sm:-mx-[10rem] px-3 sm:px-0">
      <div className="relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden shadow-lg mb-8">
        <Image
          src="/party.avif"
          alt="Event cover image"
          className="object-cover hover:scale-105 transition-transform duration-500"
          fill
          priority
        />
      </div>

      {/* Mobile Admin Access - Add this section */}
      {isAdmin && eventStatus !== "ended" && (
        <div className="sm:hidden fixed bottom-[80px] left-0 right-0 bg-blue-600 border-t p-3 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-medium">Admin Access</span>
            </div>
            <Link href={`/e/1/settings`} className="text-sm text-white">
              Manage event →
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Tickets - Fixed at bottom */}
      {eventStatus !== "ended" && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
          {isRegistered ? (
            <div className="flex items-center justify-between">
              <p className="font-semibold text-xl tracking-tight">Registered</p>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                onClick={() => (window.location.href = "/e/ticket/123")} // Replace 123 with actual ticket ID
              >
                <TicketIcon className="w-4 h-4" />
                View Ticket
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-[6px]">
                  <p className="font-semibold text-lg">
                    {eventData.registration.price}
                  </p>
                  <span
                    className="mt-[2px]"
                    onClick={() => setShowRegistrationInfo(true)}
                  >
                    <InfoIcon className="size-3 text-muted-foreground cursor-pointer hover:text-gray-900" />
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {eventData.registration.spotsLeft} spots left
                </p>
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleRegisterClick}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Badges and Title */}
      <div className="space-y-6 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          {eventStatus === "ended" ? (
            <div className="flex items-center gap-2 text-gray-600 text-base">
              <span className="font-medium">Event ended</span>
              <span className="text-muted-foreground">{endedTimeAgo}</span>
            </div>
          ) : null}
          {isRecentlyAdded() && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors px-3 py-1 text-sm"
            >
              Recently Added
            </Badge>
          )}
          {eventData.isInPerson && (
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors px-3 py-1 text-sm"
            >
              In Person
            </Badge>
          )}
        </div>

        {/* Title, organizer and countdown section */}
        <div className="space-y-3">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            {eventData.title}
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pr-2">
            <p className="sm:ml-2 text-muted-foreground">
              by <span className="font-medium">{eventData.organizer}</span>
            </p>
            {eventStatus === "ongoing" && (
              <div className="flex items-center gap-1.5 animate-pulse">
                <div className="text-emerald-600 rounded-lg px-2 py-1.5 font-semibold tracking-tight text-lg">
                  Going on now
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <div className="flex-[2]">
          <CardContent className="bg-white rounded-xl p-4 sm:p-8 space-y-8 shadow-sm">
            <div className="space-y-6">
              <div className="flex gap-4 sm:gap-6 items-start">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mt-1 text-blue-600" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-base sm:text-lg">
                    Date and time
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 pt-2">
                    <div className="bg-blue-50 rounded-lg px-3 py-2">
                      <p className="font-medium text-xs sm:text-sm">
                        {formatDate(eventData.dateTime.start.isoString)} at{" "}
                        {formatTime(eventData.dateTime.start.isoString)}
                      </p>
                    </div>
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      to
                    </span>
                    <div className="bg-blue-50 rounded-lg px-3 py-2">
                      <p className="font-medium text-xs sm:text-sm">
                        {formatDate(eventData.dateTime.end.isoString)} at{" "}
                        {formatTime(eventData.dateTime.end.isoString)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 items-start">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mt-1 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">
                    Location
                  </h3>
                  <p className="font-medium text-base sm:text-lg">
                    {eventData.location.name}
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {eventData.location.address}
                  </p>
                  {eventData.location.additionalDetails && (
                    <p className="text-muted-foreground mt-2 text-xs sm:text-sm">
                      Additional Details: {eventData.location.additionalDetails}
                    </p>
                  )}
                  <Button
                    variant="link"
                    className="px-0 text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    onClick={() => setShowMap(!showMap)}
                  >
                    {showMap ? "Hide map" : "Show map"}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showMap ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                  {showMap && (
                    <div className="space-y-2">
                      <div className="mt-1 w-full rounded-md overflow-hidden">
                        <img
                          src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
                            eventData.location.address
                          )}&zoom=15&size=600x200&scale=2&markers=${encodeURIComponent(
                            eventData.location.address
                          )}&key=${
                            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                          }`}
                          alt="Event location map"
                          className="w-full h-[200px] object-cover"
                        />
                      </div>
                      <a
                        href={`https://www.google.com/maps/place/?q=place_id:${eventData.location.placeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {eventData.website && (
                <div className="flex gap-4 sm:gap-6 items-start">
                  <ExternalLinkIcon className="w-5 h-5 sm:w-6 sm:h-6 mt-1 text-blue-600" />
                  <div className="-space-y-4">
                    <h3 className="font-semibold text-base sm:text-lg">
                      Event Website
                    </h3>
                    <Button
                      variant="link"
                      className="px-0 text-blue-600 hover:text-blue-700"
                      onClick={() => window.open(eventData.website, "_blank")}
                    >
                      Visit website
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl sm:text-2xl font-semibold">
                About this event
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                {eventData.description}
              </p>
            </div>

            <div className="space-y-3 border-t pt-6">
              <h2 className="text-xl sm:text-2xl font-semibold">
                Contact Information
              </h2>
              <div className="flex gap-4 items-center p-4 border rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">{eventData.contact.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {eventData.contact.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {eventData.contact.phone}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>

        <div className="hidden sm:block flex-1">
          <div className="sticky top-24 space-y-6 bg-white rounded-xl p-4 sm:p-8 shadow-sm">
            {isAdmin && eventStatus !== "ended" && (
              <>
                <div className="flex flex-col gap-3 p-4 sm:p-6 border rounded-xl bg-blue-50">
                  <div className="flex items-center gap-2 text-blue-700">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-medium">Admin Access</span>
                  </div>
                  <Link
                    href={`/e/1/settings`}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Manage event settings →
                  </Link>
                </div>
                <Separator />
              </>
            )}

            {isRegistered ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors gap-4">
                <div className="flex flex-col items-center text-center space-y-4 w-full">
                  <p className=" font-semibold text-xl tracking-tight">
                    Registered
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto flex items-center gap-2"
                    onClick={() => (window.location.href = "/e/ticket/123")} // Replace 123 with actual ticket ID
                  >
                    <TicketIcon className="w-4 h-4" />
                    View Ticket
                  </Button>
                </div>
              </div>
            ) : eventStatus === "ended" ? (
              <div className="text-center p-4 sm:p-6 border rounded-xl bg-gray-50">
                <p className="font-semibold text-xl tracking-tight text-gray-600">
                  This event has ended
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Registration
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors gap-4">
                  <div>
                    <p className="font-semibold text-base sm:text-lg">
                      {eventData.registration.price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {eventData.registration.spotsLeft} spots left
                    </p>
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                    onClick={handleRegisterClick}
                  >
                    Register
                  </Button>
                </div>
                {eventData.registration.requiresApproval && (
                  <p className="text-xs text-muted-foreground italic">
                    * Registration for this event requires approval from the
                    organizer. They will review your request and confirm your
                    spot.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

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

      <RegistrationDialog
        isOpen={showRegistrationConfirm}
        eventName={eventData.title}
        onOpenChange={setShowRegistrationConfirm}
        onConfirm={handleRegistrationConfirm}
      />

      <RegistrationInfoDialog
        isOpen={showRegistrationInfo}
        onOpenChange={setShowRegistrationInfo}
        requiresApproval={eventData.registration.requiresApproval}
      />
    </div>
  );
}
