"use client";

import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import CreateEventLayout from "./components/CreateEventLayout";
import CreateEventHeader from "./components/CreateEventHeader";
import BasicInfoForm from "./components/BasicInfoForm";
import { Label } from "@/components/ui/label";
import EventOptions from "./components/EventOptions";
import PriceDialog from "./components/Dialogs/PriceDialog";
import CapacityDialog from "./components/Dialogs/CapacityDialog";
import ContactDialog from "./components/Dialogs/ContactDialog";
import WebsiteDialog from "./components/Dialogs/WebsiteDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { parse } from "date-fns";

interface ContactPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function EventCreator() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [locationType, setLocationType] = useState<"venue" | "online" | null>(
    null
  );
  const [location, setLocation] = useState<{
    place_id?: string;
    description: string;
    isCustom?: boolean;
    structured_formatting?: {
      main_text: string;
      secondary_text: string;
    };
    latitude?: number;
    longitude?: number;
  } | null>(null);
  const [organizer, setOrganizer] = useState("");
  const [description, setDescription] = useState("");
  const [isCapacityDialogOpen, setIsCapacityDialogOpen] = useState(false);
  const [capacity, setCapacity] = useState<number | null>(null);
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const [priceType, setPriceType] = useState("free");
  const [visibility, setVisibility] = useState("public");
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isWebsiteDialogOpen, setIsWebsiteDialogOpen] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [contacts, setContacts] = useState<ContactPerson[]>([
    { id: "1", name: "", email: "", phone: "" },
  ]);
  const [requireApproval, setRequireApproval] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [locationAdditionalDetails, setLocationAdditionalDetails] =
    useState("");
  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <div>
        <div className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Skeleton className="h-[300px] w-full rounded-lg" />
                <div className="absolute bottom-4 right-4"></div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-[120px] w-full" />
            </div>

            {/* Organizer */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Event Options */}
          <div className="mt-8 space-y-4">
            <Skeleton className="h-5 w-36" />
            <div className="grid gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Button */}
          <div className="mt-8">
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    // Combine date and time into ISO strings
    const getISOString = (date: Date | undefined, timeStr: string) => {
      if (!date || !timeStr) return undefined;
      const newDate = new Date(date);
      const timeObj = parse(timeStr, "h:mm a", new Date());
      newDate.setHours(timeObj.getHours());
      newDate.setMinutes(timeObj.getMinutes());
      return newDate.toISOString();
    };

    const eventData = {
      // Event Details
      name: eventName,
      description,
      organizer,

      // Date and Time
      startDate: getISOString(startDate, startTime),
      endDate: getISOString(endDate, endTime),

      // Location
      locationType,
      location: location
        ? {
            placeId: location.place_id,
            description: location.description,
            isCustom: location.isCustom,
            mainText: location.structured_formatting?.main_text,
            secondaryText: location.structured_formatting?.secondary_text,
            additionalDetails: locationAdditionalDetails,
            latitude: location.latitude,
            longitude: location.longitude,
          }
        : null,
      meetingLink: locationType === "online" ? meetingLink : null,

      // Website
      websiteUrl,

      // Event Options
      price,
      priceType,
      capacity,
      visibility,
      requireApproval,

      // Contact Details
      contacts: contacts.filter((c) => c.name || c.email || c.phone),
    };

    console.log("Event Data:", eventData);
  };

  return (
    <CreateEventLayout onSubmit={handleSubmit}>
      <CreateEventHeader
        eventName={eventName}
        onEventNameChange={setEventName}
      />
      <CardContent className="mt-4 space-y-6">
        <BasicInfoForm
          startDate={startDate}
          endDate={endDate}
          startTime={startTime}
          endTime={endTime}
          websiteUrl={websiteUrl}
          description={description}
          organizer={organizer}
          locationType={locationType}
          location={location}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
          onWebsiteDialogOpen={() => setIsWebsiteDialogOpen(true)}
          onDescriptionChange={setDescription}
          onOrganizerChange={setOrganizer}
          onLocationTypeChange={setLocationType}
          onLocationChange={setLocation}
          meetingLink={meetingLink}
          onMeetingLinkChange={setMeetingLink}
          additionalDetails={locationAdditionalDetails}
          onAdditionalDetailsChange={setLocationAdditionalDetails}
        />

        <div className="space-y-1">
          <Label htmlFor="contacts">Contact Details</Label>
          <div
            onClick={() => setIsContactDialogOpen(true)}
            className="flex h-9 sm:h-10 w-full cursor-pointer items-center rounded-md border-none bg-white px-3 text-xs text-muted-foreground hover:bg-gray-50/90 sm:text-sm"
          >
            {contacts.some((c) => c.name)
              ? contacts
                  .filter((c) => c.name)
                  .map((c) => c.name)
                  .join(", ")
              : "Add contact persons"}
          </div>
        </div>

        <EventOptions
          priceType={priceType}
          price={price}
          capacity={capacity}
          visibility={visibility}
          requireApproval={requireApproval}
          onPriceDialogOpen={() => setIsPriceDialogOpen(true)}
          onCapacityDialogOpen={() => setIsCapacityDialogOpen(true)}
          onPriceTypeChange={setPriceType}
          onVisibilityChange={setVisibility}
          onRequireApprovalChange={setRequireApproval}
        />

        <PriceDialog
          isOpen={isPriceDialogOpen}
          price={price}
          onOpenChange={setIsPriceDialogOpen}
          onPriceChange={setPrice}
          onPriceTypeChange={setPriceType}
        />

        <CapacityDialog
          isOpen={isCapacityDialogOpen}
          capacity={capacity}
          onOpenChange={setIsCapacityDialogOpen}
          onCapacityChange={setCapacity}
        />

        <ContactDialog
          isOpen={isContactDialogOpen}
          contacts={contacts}
          onOpenChange={setIsContactDialogOpen}
          onContactsChange={setContacts}
        />

        <WebsiteDialog
          isOpen={isWebsiteDialogOpen}
          websiteUrl={websiteUrl}
          onOpenChange={setIsWebsiteDialogOpen}
          onWebsiteUrlChange={setWebsiteUrl}
        />
      </CardContent>
    </CreateEventLayout>
  );
}
