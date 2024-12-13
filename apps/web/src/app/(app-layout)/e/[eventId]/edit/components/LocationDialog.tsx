import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Globe } from "lucide-react";
import { useState } from "react";
import Location from "@/app/(app-layout)/create/components/Location";

interface LocationDialogProps {
  locationType: "venue" | "online" | null;
  location: {
    place_id?: string;
    description: string;
    isCustom?: boolean;
    structured_formatting?: {
      main_text: string;
      secondary_text: string;
    };
  } | null;
  meetingLink: string;
  additionalDetails: string;
  onLocationTypeChange: (type: "venue" | "online" | null) => void;
  onLocationChange: (
    location: {
      place_id?: string;
      description: string;
      isCustom?: boolean;
      structured_formatting?: {
        main_text: string;
        secondary_text: string;
      };
    } | null
  ) => void;
  onMeetingLinkChange: (link: string) => void;
  onAdditionalDetailsChange: (details: string) => void;
}

export default function LocationDialog({
  locationType,
  location,
  meetingLink,
  additionalDetails,
  onLocationTypeChange,
  onLocationChange,
  onMeetingLinkChange,
  onAdditionalDetailsChange,
}: LocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [tempLocationType, setTempLocationType] = useState(locationType);
  const [tempLocation, setTempLocation] = useState(location);
  const [tempMeetingLink, setTempMeetingLink] = useState(meetingLink);
  const [tempAdditionalDetails, setTempAdditionalDetails] =
    useState(additionalDetails);

  const handleSave = () => {
    onLocationTypeChange(tempLocationType);
    onLocationChange(tempLocation);
    onMeetingLinkChange(tempMeetingLink);
    onAdditionalDetailsChange(tempAdditionalDetails);
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      // When opening, initialize temp values
      setTempLocationType(locationType);
      setTempLocation(location);
      setTempMeetingLink(meetingLink);
      setTempAdditionalDetails(additionalDetails);
    }
    setOpen(newOpen);
  };

  const getLocationSummary = () => {
    if (!locationType) return "No location set";
    if (locationType === "venue") {
      if (location?.structured_formatting) {
        return `${location.structured_formatting.main_text}, ${location.structured_formatting.secondary_text}`;
      }
      return location?.description || "No venue specified";
    }
    return meetingLink || "No meeting link specified";
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {locationType === "venue" ? (
                <MapPin className="h-4 w-4" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
              <span className="font-medium">
                {locationType === "venue" ? "Venue" : "Online"}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
              Edit
            </Button>
          </div>
          <p className="text-sm">{getLocationSummary()}</p>
          {additionalDetails && (
            <p className="text-sm text-muted-foreground">{additionalDetails}</p>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-xs sm:max-w-lg rounded-xl bg-[#F9F9F8] [&>button]:hidden">
        <DialogHeader className="text-center">
          <DialogTitle>Edit Location</DialogTitle>
        </DialogHeader>
        <Location
          locationType={tempLocationType}
          location={tempLocation}
          onLocationTypeChange={setTempLocationType}
          onLocationChange={setTempLocation}
          meetingLink={tempMeetingLink}
          onMeetingLinkChange={setTempMeetingLink}
          additionalDetails={tempAdditionalDetails}
          onAdditionalDetailsChange={setTempAdditionalDetails}
        />
        <DialogFooter className="mt-6">
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
