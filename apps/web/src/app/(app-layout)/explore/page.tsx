/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CalendarIcon, MapPinIcon, SearchIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import Image from "next/image";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  capacity: number;
  imageUrl: string;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2024",
    date: "2024-12-20T09:00:00Z",
    location: "San Francisco, CA",
    capacity: 500,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
  },
  {
    id: "2",
    title: "Music Festival 2024",
    date: "2024-12-25T18:00:00Z",
    location: "Los Angeles, CA",
    capacity: 1000,
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
  },
  {
    id: "3",
    title: "Tech Conference 2024",
    date: "2024-12-20T09:00:00Z",
    location: "San Francisco, CA",
    capacity: 500,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
  },
  {
    id: "4",
    title: "Music Festival 2024",
    date: "2024-12-25T18:00:00Z",
    location: "Los Angeles, CA",
    capacity: 1000,
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
  },
  {
    id: "5",
    title: "Tech Conference 2024",
    date: "2024-12-20T09:00:00Z",
    location: "San Francisco, CA",
    capacity: 500,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
  },
  {
    id: "6",
    title: "Music Festival 2024",
    date: "2024-12-25T18:00:00Z",
    location: "Los Angeles, CA",
    capacity: 1000,
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
  },
  {
    id: "7",
    title: "Tech Conference 2024",
    date: "2024-12-20T09:00:00Z",
    location: "San Francisco, CA",
    capacity: 500,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
  },
  {
    id: "8",
    title: "Music Festival 2024",
    date: "2024-12-25T18:00:00Z",
    location: "Los Angeles, CA",
    capacity: 1000,
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop",
  },
];

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Explore Events
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-12 pr-4 rounded-full bg-white shadow-sm border-0 text-base placeholder:text-gray-400 placeholder:text-sm"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 pt-2">
        {mockEvents.map((event) => (
          <Link href={`/e/${event.id}`} key={event.id} className="group">
            <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              </div>
              <div className="absolute bottom-0 w-full p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <div className="space-y-1 text-sm opacity-90">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(parseISO(event.date), "PPP")}
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
