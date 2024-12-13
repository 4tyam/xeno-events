/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  TicketIcon,
  SettingsIcon,
  CalendarDays,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  location: string;
  coverImage: {
    src: string;
    alt: string;
  };
  dateTime: {
    start: {
      isoString: string;
    };
    end: {
      isoString: string;
    };
  };
}

interface TimelineEvent {
  events: Event[];
}

const timelineEvents: TimelineEvent[] = [
  {
    events: [
      {
        id: "1",
        title: "Soap Making Ws",
        location: "Eden Park",
        coverImage: {
          src: "/party.avif",
          alt: "Event cover image",
        },
        dateTime: {
          start: {
            isoString: "2025-02-01T14:00:00.000Z",
          },
          end: {
            isoString: "2025-02-04T15:30:00.000Z",
          },
        },
      },
      {
        id: "2",
        title: "Team Xeno event",
        location: "Eden Park",
        coverImage: {
          src: "/party.avif",
          alt: "Event cover image",
        },
        dateTime: {
          start: {
            isoString: "2024-01-01T16:00:00.000Z",
          },
          end: {
            isoString: "2024-03-01T17:30:00.000Z",
          },
        },
      },
    ],
  },
];

// Function to format date
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
};

// Function to format mobile date (shorter version)
const formatMobileDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Function to format time
const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Function to check if dates are on the same day
const isSameDay = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate()
  );
};

// Function to check if an event is upcoming
const isUpcomingEvent = (isoString: string) => {
  const eventDate = new Date(isoString);
  return eventDate > new Date();
};

export default function EventsPage() {
  const [isLoading] = useState(false);
  const hasEvents = true;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Events
        </h2>
      </div>

      {/* Events Container */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start gap-3 shadow-md"
            >
              {/* Main content wrapper */}
              <div className="flex flex-row justify-between w-full gap-3">
                {/* Event details */}
                <div className="space-y-1.5 flex-grow min-w-0">
                  <div>
                    <Skeleton className="h-7 sm:h-8 w-48 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>

                  <div className="space-y-0.5 mt-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-3.5 flex-shrink-0 text-gray-400" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="size-3.5 flex-shrink-0 text-gray-400" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>

                {/* Image skeleton */}
                <div className="flex-shrink-0">
                  <Skeleton className="size-[88px] sm:w-[180px] sm:h-[130px] rounded-lg" />
                </div>
              </div>

              {/* Mobile actions */}
              <div className="sm:hidden flex items-center gap-2 w-full">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : !hasEvents ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-gray-50/80 p-14 rounded-full">
              <CalendarDays className="size-40 text-gray-300" />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight">
              No events found
            </h3>
            <p className="text-gray-500 max-w-[400px]">
              There are no events at the moment. Explore upcoming events or
              create your own!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/explore">
              <Button variant="outline">Explore events</Button>
            </Link>
            <Link href="/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <PlusIcon />
                Create an event
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Events */}
          {timelineEvents.some((timelineEvent) =>
            timelineEvent.events.some((event) =>
              isUpcomingEvent(event.dateTime.start.isoString)
            )
          ) && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-6">
                {timelineEvents.map((timelineEvent) =>
                  timelineEvent.events
                    .filter((event) =>
                      isUpcomingEvent(event.dateTime.start.isoString)
                    )
                    .map((event) => (
                      <div
                        key={event.id}
                        className="bg-white rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start gap-3 shadow-md hover:scale-105 transition-all duration-300"
                      >
                        {/* Main content wrapper */}
                        <div className="flex flex-row justify-between w-full gap-3">
                          {/* Event details */}
                          <div className="space-y-1.5 flex-grow min-w-0">
                            <Link href={`/e/${event.id}`} className="block">
                              <div className="pb-2">
                                <h2 className="text-lg sm:text-xl font-semibold truncate">
                                  {event.title}
                                </h2>
                                <div className="text-gray-500 text-sm">
                                  <span className="hidden sm:inline">
                                    {isSameDay(
                                      event.dateTime.start.isoString,
                                      event.dateTime.end.isoString
                                    )
                                      ? `${formatDate(
                                          event.dateTime.start.isoString
                                        )}, ${formatTime(
                                          event.dateTime.start.isoString
                                        )} - ${formatTime(
                                          event.dateTime.end.isoString
                                        )}`
                                      : `${formatDate(
                                          event.dateTime.start.isoString
                                        )}, ${formatTime(
                                          event.dateTime.start.isoString
                                        )} - ${formatDate(
                                          event.dateTime.end.isoString
                                        )}, ${formatTime(
                                          event.dateTime.end.isoString
                                        )}`}
                                  </span>
                                  <span className="sm:hidden">
                                    {isSameDay(
                                      event.dateTime.start.isoString,
                                      event.dateTime.end.isoString
                                    )
                                      ? `${formatMobileDate(
                                          event.dateTime.start.isoString
                                        )}, ${formatTime(
                                          event.dateTime.start.isoString
                                        )} - ${formatTime(
                                          event.dateTime.end.isoString
                                        )}`
                                      : `${formatMobileDate(
                                          event.dateTime.start.isoString
                                        )}, ${formatTime(
                                          event.dateTime.start.isoString
                                        )} - ${formatMobileDate(
                                          event.dateTime.end.isoString
                                        )}, ${formatTime(
                                          event.dateTime.end.isoString
                                        )}`}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="size-3.5 flex-shrink-0" />
                                  <span className="text-sm truncate">
                                    {event.location}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Users className="size-3.5 flex-shrink-0" />
                                  <span className="text-sm">Online</span>
                                </div>
                              </div>
                            </Link>

                            {/* Desktop buttons */}
                            <div className="hidden sm:flex items-center gap-3 pt-1">
                              <Link href={`/e/${event.id}/settings`}>
                                <Button
                                  size="sm"
                                  className="bg-black text-white"
                                >
                                  <SettingsIcon className="size-3" />
                                  Event Settings
                                </Button>
                              </Link>

                              <Link href={`/e/ticket/${event.id}`}>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <TicketIcon className="size-3" />
                                  My Ticket
                                </Button>
                              </Link>
                            </div>
                          </div>

                          {/* Image */}
                          <Link
                            href={`/e/${event.id}`}
                            className="block flex-shrink-0"
                          >
                            <div className="size-[88px] sm:w-[180px] sm:h-[130px]">
                              <img
                                src={event.coverImage.src}
                                alt={event.coverImage.alt}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          </Link>
                        </div>

                        {/* Mobile buttons */}
                        <div className="flex sm:hidden items-center gap-3 w-full">
                          <Link href={`/e/${event.id}/settings`}>
                            <Button size="sm">
                              <SettingsIcon className="bg-black text-white" />
                              Event Settings
                            </Button>
                          </Link>
                          <Link href={`/e/ticket/${event.id}`}>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <TicketIcon className="size-3" />
                              My Ticket
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Completed Events */}
          {timelineEvents.some((timelineEvent) =>
            timelineEvent.events.some(
              (event) => !isUpcomingEvent(event.dateTime.start.isoString)
            )
          ) && (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Completed Events</h3>
              <div className="space-y-6">
                {timelineEvents.map((timelineEvent) =>
                  timelineEvent.events
                    .filter(
                      (event) =>
                        !isUpcomingEvent(event.dateTime.start.isoString)
                    )
                    .map((event) => (
                      <div
                        key={event.id}
                        className="bg-white rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start gap-3 shadow-md hover:scale-105 transition-all duration-300"
                      >
                        {/* Main content wrapper */}
                        <div className="flex flex-row justify-between w-full gap-3">
                          {/* Event details */}
                          <div className="space-y-1.5 flex-grow min-w-0">
                            <Link href={`/e/${event.id}`} className="block">
                              <div className="pb-2">
                                <h2 className="text-lg sm:text-xl font-semibold truncate">
                                  {event.title}
                                </h2>
                                <div className="text-gray-500 text-sm">
                                  <span className="hidden sm:inline">
                                    {isSameDay(
                                      event.dateTime.start.isoString,
                                      event.dateTime.end.isoString
                                    )
                                      ? `${formatDate(
                                          event.dateTime.start.isoString
                                        )}, ${formatTime(
                                          event.dateTime.start.isoString
                                        )} - ${formatTime(
                                          event.dateTime.end.isoString
                                        )}`
                                      : `${formatDate(
                                          event.dateTime.start.isoString
                                        )}, ${formatTime(
                                          event.dateTime.start.isoString
                                        )} - ${formatDate(
                                          event.dateTime.end.isoString
                                        )}, ${formatTime(
                                          event.dateTime.end.isoString
                                        )}`}
                                  </span>
                                  <span className="sm:hidden">
                                    {isSameDay(
                                      event.dateTime.start.isoString,
                                      event.dateTime.end.isoString
                                    )
                                      ? `${formatMobileDate(
                                          event.dateTime.start.isoString
                                        )}, ${formatTime(
                                          event.dateTime.start.isoString
                                        )} - ${formatTime(
                                          event.dateTime.end.isoString
                                        )}`
                                      : `${formatMobileDate(
                                          event.dateTime.start.isoString
                                        )}, ${formatTime(
                                          event.dateTime.start.isoString
                                        )} - ${formatMobileDate(
                                          event.dateTime.end.isoString
                                        )}, ${formatTime(
                                          event.dateTime.end.isoString
                                        )}`}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="size-3.5 flex-shrink-0" />
                                  <span className="text-sm truncate">
                                    {event.location}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Users className="size-3.5 flex-shrink-0" />
                                  <span className="text-sm">Online</span>
                                </div>
                              </div>
                            </Link>

                            {/* Desktop buttons */}
                            <div className="hidden sm:flex items-center gap-3 pt-1">
                              <Link href={`/e/${event.id}/settings`}>
                                <Button
                                  size="sm"
                                  className="bg-black text-white"
                                >
                                  <SettingsIcon className="size-3" />
                                  Event Settings
                                </Button>
                              </Link>

                              <Link href={`/e/ticket/${event.id}`}>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <TicketIcon className="size-3" />
                                  My Ticket
                                </Button>
                              </Link>
                            </div>
                          </div>

                          {/* Image */}
                          <Link
                            href={`/e/${event.id}`}
                            className="block flex-shrink-0"
                          >
                            <div className="size-[88px] sm:w-[180px] sm:h-[130px]">
                              <img
                                src={event.coverImage.src}
                                alt={event.coverImage.alt}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          </Link>
                        </div>

                        {/* Mobile buttons */}
                        <div className="flex sm:hidden items-center gap-3 w-full">
                          <Link href={`/e/${event.id}/settings`}>
                            <Button size="sm">
                              <SettingsIcon className="bg-black text-white" />
                              Event Settings
                            </Button>
                          </Link>
                          <Link href={`/e/ticket/${event.id}`}>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <TicketIcon className="size-3" />
                              My Ticket
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
