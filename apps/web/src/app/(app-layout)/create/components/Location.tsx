/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Globe,
  Search,
  XIcon,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLoadScript } from "@react-google-maps/api";
import { Label } from "@/components/ui/label";

interface Location {
  place_id: string;
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
}

declare global {
  interface Window {
    google: any;
  }
}

interface LocationProps {
  locationType: "venue" | "online" | null;
  location: {
    place_id?: string;
    description: string;
    isCustom?: boolean;
    structured_formatting?: {
      main_text: string;
      secondary_text: string;
    };
    latitude?: number;
    longitude?: number;
  } | null;
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
      latitude?: number;
      longitude?: number;
    } | null
  ) => void;
  meetingLink?: string;
  onMeetingLinkChange?: (link: string) => void;
  additionalDetails?: string;
  onAdditionalDetailsChange?: (details: string) => void;
}

interface LocationState {
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
}

// Define libraries array as a static constant outside the component
const GOOGLE_MAPS_LIBRARIES: ("places" | "marker")[] = ["places", "marker"];

export default function Location({
  locationType,
  location,
  onLocationTypeChange,
  onLocationChange,
  meetingLink = "",
  onMeetingLinkChange = () => {},
  additionalDetails = "",
  onAdditionalDetailsChange = () => {},
}: LocationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<Location[]>([]);
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const [internalLocation, setInternalLocation] =
    useState<LocationState | null>(null);
  const [showAdditionalDetailsInput, setShowAdditionalDetailsInput] =
    useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES, // Use the static constant here
  });

  useEffect(() => {
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    if (searchQuery && autocompleteService.current) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        autocompleteService.current.getPlacePredictions(
          { input: searchQuery },
          (predictions: Location[], status: string) => {
            setIsSearching(false);
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setPredictions(predictions);
            } else {
              console.error("Autocomplete prediction failed:", status);
              setPredictions([]);
            }
          }
        );
      }, 300);

      return () => {
        clearTimeout(timer);
        setIsSearching(false);
      };
    } else {
      setPredictions([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    setInternalLocation(location);
  }, [location]);

  const handleLocationSelect = (loc: Location) => {
    if (loc.place_id === "custom") {
      const customLocation = {
        place_id: "custom",
        description: searchQuery,
        isCustom: true,
        structured_formatting: {
          main_text: searchQuery,
          secondary_text: "Custom Location",
        },
      };
      onLocationChange(customLocation);
      setInternalLocation(customLocation);
    } else {
      placesService.current.getDetails(
        {
          placeId: loc.place_id,
          fields: ["place_id", "name", "geometry", "formatted_address"],
        },
        (place: any, status: string) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const newLocation = {
              place_id: loc.place_id,
              description: place.name,
              isCustom: false,
              structured_formatting: {
                main_text: place.name,
                secondary_text: place.formatted_address,
              },
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
            };
            setInternalLocation({
              ...newLocation,
              geometry: {
                location: {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                },
              },
            });
            onLocationChange(newLocation);
          }
        }
      );
    }
    setSearchQuery("");
    setPredictions([]);
    setIsLocationPopoverOpen(false);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setIsLocationPopoverOpen(open);
    if (!open && !internalLocation) {
      onLocationTypeChange(null);
    }
  };

  useEffect(() => {
    if (
      isLoaded &&
      internalLocation?.geometry &&
      !mapRef.current &&
      !internalLocation.isCustom
    ) {
      const mapElement = document.getElementById("map");
      if (mapElement) {
        const map = new window.google.maps.Map(mapElement, {
          center: internalLocation.geometry.location,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || "",
        });

        if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID) {
          new window.google.maps.marker.AdvancedMarkerElement({
            position: internalLocation.geometry.location,
            map: map,
          });
        } else {
          new window.google.maps.Marker({
            position: internalLocation.geometry.location,
            map: map,
          });
        }

        mapRef.current = map;
      }
    }
  }, [isLoaded, internalLocation]);

  const handleLocationTypeChange = (type: "venue" | "online") => {
    if (type === locationType && !internalLocation) {
      onLocationTypeChange(null);
      onLocationChange(null);
      setInternalLocation(null);
      mapRef.current = null;
      if (type === "online") {
        onMeetingLinkChange("");
      }
    } else {
      onLocationTypeChange(type);
      if (type === "online") {
        onLocationChange(null);
        setInternalLocation(null);
        mapRef.current = null;
      } else {
        onMeetingLinkChange("");
      }
    }
  };

  const handleClearLocation = () => {
    onLocationChange(null);
    onLocationTypeChange(null);
    setInternalLocation(null);
    mapRef.current = null;
  };

  if (loadError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500">
        Error loading maps. Please check your connection and try again.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Location
      </label>
      <div className="flex flex-wrap gap-2 pb-2">
        <Popover
          open={isLocationPopoverOpen}
          onOpenChange={handlePopoverOpenChange}
        >
          <PopoverTrigger asChild>
            <Button
              variant="xenoSecondary"
              className={`flex-none ${
                locationType === "venue"
                  ? "bg-blue-600 text-primary-foreground hover:bg-blue-700"
                  : ""
              }`}
              onClick={() => handleLocationTypeChange("venue")}
            >
              <MapPin className="h-4 w-4" />
              Location
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 border-none p-0" align="start">
            <div className="relative flex items-center gap-2 px-3">
              <Search className="mt-2 h-4 w-4 shrink-0 text-muted-foreground/70" />
              <Input
                placeholder="Search locations..."
                className="mt-2 h-6 w-full border-none bg-transparent p-0 text-sm shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="max-h-[300px] overflow-auto p-1.5">
              {isSearching ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/70" />
                </div>
              ) : (
                <>
                  {predictions.map((prediction) => (
                    <button
                      key={prediction.place_id}
                      className="flex w-full items-start gap-2 rounded-md p-2.5 text-left transition-colors hover:bg-gray-50/90"
                      onClick={() => handleLocationSelect(prediction)}
                    >
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {prediction.structured_formatting?.main_text ||
                            prediction.description}
                        </span>
                        {prediction.structured_formatting?.secondary_text && (
                          <span className="text-xs text-muted-foreground/70">
                            {prediction.structured_formatting.secondary_text}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                  {searchQuery && (
                    <button
                      className="flex w-full items-center gap-2 rounded-md p-2.5 text-left transition-colors hover:bg-gray-50/90"
                      onClick={() =>
                        handleLocationSelect({
                          place_id: "custom",
                          description: searchQuery,
                          isCustom: true,
                          structured_formatting: {
                            main_text: searchQuery,
                            secondary_text: "Custom Location",
                          },
                        })
                      }
                    >
                      <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Use &quot;{searchQuery}&quot;
                      </span>
                    </button>
                  )}
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="xenoSecondary"
          className={`flex-none ${
            locationType === "online"
              ? "bg-blue-600 text-primary-foreground hover:bg-blue-700"
              : ""
          }`}
          onClick={() => handleLocationTypeChange("online")}
        >
          <Globe className="h-4 w-4" />
          Online
        </Button>
        {locationType === "online" && (
          <div className="mt-2 w-full sm:mt-0 sm:w-auto sm:flex-1">
            <Input
              placeholder="Paste meeting link (optional)"
              value={meetingLink}
              onChange={(e) => onMeetingLinkChange(e.target.value)}
              className="h-9 sm:h-10  w-full rounded-md border-none bg-gray-50/90 text-xs shadow-none placeholder:text-xs hover:bg-gray-50/90 sm:text-sm sm:placeholder:text-sm"
            />
          </div>
        )}
      </div>
      {locationType === "venue" && internalLocation && (
        <div className="space-y-2">
          <div className="relative rounded-lg bg-gray-50/90 p-4">
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 shrink-0" />
                <div>
                  <div className="font-medium">
                    {internalLocation.structured_formatting?.main_text ||
                      internalLocation.description}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {internalLocation.structured_formatting?.secondary_text}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleClearLocation}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
            {!internalLocation.isCustom && (
              <>
                <div id="map" className="h-[200px] w-full rounded-md" />
                <div className="mt-4">
                  {!showAdditionalDetailsInput && !additionalDetails ? (
                    <Button
                      variant="ghost"
                      className="h-9 sm:h-10 justify-start rounded-md bg-white/80 px-3 text-xs text-muted-foreground hover:bg-white/90 sm:text-sm"
                      onClick={() => setShowAdditionalDetailsInput(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add additional details
                    </Button>
                  ) : (
                    <>
                      <div className="flex flex-row items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-xs text-muted-foreground sm:text-sm"
                          onClick={() => setShowAdditionalDetailsInput(false)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Label className="ml-1">Additional details</Label>
                      </div>
                      <Input
                        placeholder="Apt no, room no, etc."
                        value={additionalDetails}
                        onChange={(e) =>
                          onAdditionalDetailsChange(e.target.value)
                        }
                        className="h-9 w-full bg-none rounded-md border-none text-xs shadow-none placeholder:text-xs sm:text-sm sm:placeholder:text-sm"
                        autoFocus={showAdditionalDetailsInput}
                      />
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
