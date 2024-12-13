/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isBefore, isEqual, parse } from "date-fns";
import { CalendarIcon, Users2 } from "lucide-react";
import LocationDialog from "./components/LocationDialog";
import ContactDialog from "./components/ContactDialog";

interface ContactPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Dummy event data - In real app, this would come from API/database
const dummyEventData = {
  locationType: "venue" as const,
  location: {
    place_id: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    description:
      "Google Building 40, 1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
    structured_formatting: {
      main_text: "Google Building 40",
      secondary_text: "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
    },
    geometry: {
      location: {
        lat: 37.4223878,
        lng: -122.0841877,
      },
    },
  },
  meetingLink: "",
  additionalDetails: "Park in the visitor parking area",
};

const EditEventPage = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [locationType, setLocationType] = useState<"venue" | "online" | null>(
    dummyEventData.locationType
  );
  const [location, setLocation] = useState<{
    place_id?: string;
    description: string;
    isCustom?: boolean;
    structured_formatting?: {
      main_text: string;
      secondary_text: string;
    };
    geometry?: {
      location: {
        lat: number;
        lng: number;
      };
    };
  } | null>(dummyEventData.location);
  const [organizer, setOrganizer] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState<number | null>(null);
  const [visibility, setVisibility] = useState("public");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [meetingLink, setMeetingLink] = useState(dummyEventData.meetingLink);
  const [additionalDetails, setAdditionalDetails] = useState(
    dummyEventData.additionalDetails
  );
  const [locationAdditionalDetails] = useState(
    dummyEventData.additionalDetails
  );
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  const today = new Date();
  const currentHour = today.getHours();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const generateTimeOptions = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = i % 12 || 12;
      const period = i < 12 ? "AM" : "PM";
      const time = `${hour}:00 ${period}`;
      times.push({
        value: time,
        label: time,
        hour: i
      });
    }
    return times;
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date && startDate && isBefore(date, startDate)) {
      // If end date is before start date, don't allow selection
      return;
    }
    setEndDate(date);
  };

  const isTimeDisabled = (time: string, isEndTime: boolean) => {
    if (!isEndTime && isEqual(startDate || new Date(), startOfToday)) {
      // For start time on today's date, disable past hours
      const timeObj = parse(time, 'h:mm a', new Date());
      const hour = timeObj.getHours();
      return hour < currentHour;
    }

    if (isEndTime) {
      if (!startDate || !endDate || !startTime) return false;
      if (!isEqual(startDate, endDate)) return false;
      
      const timeObj = parse(time, 'h:mm a', new Date());
      const startTimeObj = parse(startTime, 'h:mm a', new Date());
      
      if (isEqual(endDate, startOfToday)) {
        // For end time on today's date, also consider current hour
        return timeObj.getHours() < currentHour || isBefore(timeObj, startTimeObj);
      }
      
      return isBefore(timeObj, startTimeObj);
    }

    return false;
  };

  const handleEndTimeChange = (time: string) => {
    if (startDate && endDate && isEqual(startDate, endDate)) {
      const startTimeObj = parse(startTime, 'h:mm a', new Date());
      const endTimeObj = parse(time, 'h:mm a', new Date());
      
      if (isBefore(endTimeObj, startTimeObj)) {
        // If end time is before start time on same day, don't allow selection
        return;
      }
    }
    setEndTime(time);
  };

  const handleSubmit = () => {
    const eventData = {
      name: eventName,
      description,
      organizer,
      startDate,
      endDate,
      startTime,
      endTime,
      locationType,
      location: location
        ? {
            placeId: location.place_id,
            description: location.description,
            isCustom: location.isCustom,
            mainText: location.structured_formatting?.main_text,
            secondaryText: location.structured_formatting?.secondary_text,
            additionalDetails: locationAdditionalDetails,
          }
        : null,
      meetingLink: locationType === "online" ? meetingLink : null,
      websiteUrl,

      capacity,
      visibility,
    };

    console.log("Updated Event Data:", eventData);
    // TODO: Add API call to update event
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl">
        <div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Edit Event
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Make changes to your event details and settings
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info Section - now takes full width */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-white/50 p-6">
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarIcon className="h-4 w-4" />
              </span>
              Basic Information
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Essential details about your event
            </p>
          </div>

          <div className="space-y-6 p-6">
            <div className="space-y-5">
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src="/party.avif"
                  alt="Event cover"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <Label htmlFor="event-name" className="text-sm font-medium">
                  Event Name
                </Label>
                <Input
                  id="event-name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter event name"
                  className="mt-1.5"
                />
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Start</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="w-full">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="h-4 w-4 shrink-0" />
                            {startDate ? format(startDate, "PPP") : "24 Nov"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            disabled={(date) => isBefore(date, startOfToday)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Time" />
                      </SelectTrigger>
                      <SelectContent>
                        {generateTimeOptions().map(({ value, label }) => (
                          <SelectItem
                            className={cn(
                              "focus:bg-blue-600 focus:text-white",
                              isTimeDisabled(value, false) && "opacity-50 pointer-events-none"
                            )}
                            key={value}
                            value={value}
                            disabled={isTimeDisabled(value, false)}
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">End</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="w-full">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="h-4 w-4 shrink-0" />
                            {endDate ? format(endDate, "PPP") : "24 Nov"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={handleEndDateSelect}
                            initialFocus
                            disabled={(date) => 
                              isBefore(date, startOfToday) || 
                              (startDate ? isBefore(date, startDate) : false)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Select value={endTime} onValueChange={handleEndTimeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Time" />
                      </SelectTrigger>
                      <SelectContent>
                        {generateTimeOptions().map(({ value, label }) => (
                          <SelectItem
                            className={cn(
                              "focus:bg-blue-600 focus:text-white",
                              isTimeDisabled(value, true) && "opacity-50 pointer-events-none"
                            )}
                            key={value}
                            value={value}
                            disabled={isTimeDisabled(value, true)}
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location
                </Label>
                <LocationDialog
                  locationType={locationType}
                  location={location}
                  onLocationTypeChange={setLocationType}
                  onLocationChange={setLocation}
                  meetingLink={meetingLink}
                  onMeetingLinkChange={setMeetingLink}
                  additionalDetails={additionalDetails}
                  onAdditionalDetailsChange={setAdditionalDetails}
                />
              </div>

              <div>
                <Label
                  htmlFor="event-organizer"
                  className="text-sm font-medium"
                >
                  Organizer
                </Label>
                <Input
                  id="event-organizer"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="Enter event organizer"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label
                  htmlFor="event-description"
                  className="text-sm font-medium"
                >
                  Description
                </Label>
                <Textarea
                  id="event-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your event"
                  className="mt-1.5 min-h-[150px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Contact Details</Label>
                <div>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => setIsContactDialogOpen(true)}
                  >
                    <Users2 className="h-4 w-4" />
                    {contacts.filter(c => c.name && c.email && c.phone).length === 0
                      ? "Add contact details"
                      : `${contacts.filter(c => c.name && c.email && c.phone).length} contact${
                          contacts.filter(c => c.name && c.email && c.phone).length > 1 ? "s" : ""
                        } added`}
                  </Button>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="event-website"
                  className="text-sm font-medium"
                >
                  Website
                </Label>
                <Input
                  id="event-website"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="Enter event website"
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Options Section - modified for horizontal layout */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-white/50 p-6">
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users2 className="h-4 w-4" />
              </span>
              Options
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Additional settings
            </p>
          </div>

          {/* Changed to horizontal layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-6">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Control who can see your event
                </p>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Capacity</Label>
                <p className="text-sm text-muted-foreground">
                  Maximum number of attendees
                </p>
                <Input
                  type="number"
                  value={capacity || ""}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  placeholder="Enter capacity"
                />
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Website</Label>
                <p className="text-sm text-muted-foreground">
                  Optional event website or registration link
                </p>
                <Input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Changes Button - moved to bottom */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Save Changes
        </Button>
      </div>

      <ContactDialog
        isOpen={isContactDialogOpen}
        contacts={contacts}
        onOpenChange={setIsContactDialogOpen}
        onContactsChange={setContacts}
      />
    </div>
  );
};

export default EditEventPage;
