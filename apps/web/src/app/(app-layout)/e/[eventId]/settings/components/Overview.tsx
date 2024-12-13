import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  PenLineIcon,
  QrCodeIcon,
  Share2Icon,
  ExternalLinkIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  differenceInMinutes,
  parseISO,
  formatDistanceToNow,
  format,
} from "date-fns";
import ShareDialog from "./ShareDialog";

// Update the interface to use actual Date
interface EventData {
  title: string;
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
  location: {
    name: string;
    address: string;
  };
}

// Add interface for countdown
interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
}

const eventData: EventData = {
  title: "The Ultimate Frisbee Tournament 2024",
  coverImage: {
    src: "/party.avif",
    alt: "Event cover image",
  },
  dateTime: {
    start: {
      isoString: "2025-01-01T14:00:00.000Z",
    },
    end: {
      isoString: "2025-01-23T16:00:00.000Z",
    },
  },
  location: {
    name: "MIT World Peace University (MIT-WPU)",
    address:
      "Survey No, 124, Paud Rd, Rambaug Colony, Kothrud, Pune, Maharashtra 411038, India",
  },
};

export default function Overview() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [eventStatus, setEventStatus] = useState<
    "upcoming" | "ongoing" | "ended"
  >("upcoming");
  const [endedTimeAgo, setEndedTimeAgo] = useState("");
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const params = useParams();
  const eventId = params.eventId as string;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const startDate = parseISO(eventData.dateTime.start.isoString);
      const endDate = parseISO(eventData.dateTime.end.isoString);
      const now = new Date();

      const minutesToStart = differenceInMinutes(startDate, now);
      const minutesToEnd = differenceInMinutes(endDate, now);

      if (minutesToEnd <= 0) {
        setEventStatus("ended");
        setEndedTimeAgo(formatDistanceToNow(endDate, { addSuffix: true }));
        return { days: 0, hours: 0, minutes: 0 };
      }

      if (minutesToStart <= 0) {
        setEventStatus("ongoing");
        return { days: 0, hours: 0, minutes: 0 };
      }

      setEventStatus("upcoming");
      const days = Math.floor(minutesToStart / (24 * 60));
      const hours = Math.floor((minutesToStart % (24 * 60)) / 60);
      const minutes = minutesToStart % 60;

      return { days, hours, minutes };
    };

    // Initial calculation
    setCountdown(calculateTimeLeft());

    // Update countdown every minute
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (isoString: string) => {
    return format(parseISO(isoString), "EEE, MMMM d");
  };

  const formatTime = (isoString: string) => {
    return format(parseISO(isoString), "h:mm a");
  };

  return (
    <div className="space-y-4 pb-12">
      <div className="flex flex-row justify-between items-center gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:gap-3">
          <div className="text-gray-600 text-sm font-medium">
            {eventStatus === "ended"
              ? "Event ended"
              : eventStatus === "ongoing"
              ? ""
              : "Starting in"}
          </div>
          {eventStatus === "ended" ? (
            <div className="text-gray-600 font-medium">{endedTimeAgo}</div>
          ) : eventStatus === "ongoing" ? (
            <div className="flex items-center gap-1.5 animate-pulse">
              <div className="text-emerald-600 rounded-lg px-2 py-1.5 font-semibold tracking-tight text-lg">
                Going on now
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 animate-pulse">
              <div className="text-blue-600 rounded-lg px-0.5 py-1.5 font-semibold tracking-tight flex flex-row items-center">
                <span className="text-base sm:text-lg">{countdown.days}</span>
                <span className="text-xs sm:text-sm ml-1">days</span>
              </div>
              <div className="text-blue-600 rounded-lg px-0.5 py-1.5 font-semibold tracking-tight flex flex-row items-center">
                <span className="text-base sm:text-lg">{countdown.hours}</span>
                <span className="text-xs sm:text-sm ml-1">hrs</span>
              </div>
              <div className="text-blue-600 rounded-lg px-0.5 py-1.5 font-semibold tracking-tight flex flex-row items-center">
                <span className="text-base sm:text-lg">
                  {countdown.minutes}
                </span>
                <span className="text-xs sm:text-sm ml-1">min</span>
              </div>
            </div>
          )}
        </div>
        <Link
          href={`/e/${eventId}`}
          className="bg-blue-600 rounded-full px-3 py-2 sm:px-4 sm:py-2 font-medium text-sm tracking-tight flex flex-row items-center justify-center gap-2 text-white hover:bg-blue-700 transition-colors"
        >
          <ExternalLinkIcon className="size-4" />
          <span>View Event</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4 text-center">
              {eventData.title}
            </h2>
            <div className="sm:w-[400px]">
              <Image
                src={eventData.coverImage.src}
                alt={eventData.coverImage.alt}
                className="rounded-lg"
                width={400}
                height={300}
                priority
              />
              <div className="flex items-center justify-between text-gray-600 text-xs sm:text-sm mt-4">
                <div className="flex flex-col items-center bg-blue-50 rounded-lg px-3 py-1.5 sm:px-6 sm:py-3">
                  <p className="font-medium">
                    {formatDate(eventData.dateTime.start.isoString)}
                  </p>
                  <p>{formatTime(eventData.dateTime.start.isoString)}</p>
                </div>
                <div className="text-muted-foreground font-medium text-sm sm:text-base">
                  to
                </div>
                <div className="flex flex-col items-center bg-blue-50 rounded-lg px-3 py-1.5 sm:px-6 sm:py-3 text-xs sm:text-sm">
                  <p className="font-medium">
                    {formatDate(eventData.dateTime.end.isoString)}
                  </p>
                  <p>{formatTime(eventData.dateTime.end.isoString)}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium mb-1">Location</h3>
            <div className="text-gray-500">
              <p className="font-medium">{eventData.location.name}</p>
              <p className="text-sm truncate max-w-xl">
                {eventData.location.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {eventStatus !== "ended" && (
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-4 w-full mt-4">
          <div className="grid grid-cols-2 sm:contents gap-2">
            <button
              onClick={() => setIsShareDialogOpen(true)}
              className="font-medium tracking-tight flex flex-row items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2Icon className="size-3 sm:size-4" />
              <span className="text-sm sm:text-base">Share Event</span>
            </button>
            <Link
              href={`/e/${eventId}/edit`}
              className="font-medium tracking-tight flex flex-row items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              <PenLineIcon className="size-3 sm:size-4" />
              <span className="text-sm sm:text-base">Edit Event</span>
            </Link>
          </div>
          <Link
            href={`/e/${eventId}/check-in`}
            className="font-medium tracking-tight flex flex-row items-center justify-center mt-1 sm:mt-0 gap-2 px-4 sm:px-6 py-3 sm:py-3.5 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
          >
            <QrCodeIcon className="size-5" />
            <span className="text-sm sm:text-base">Check In</span>
          </Link>
        </div>
      )}
      <ShareDialog
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        shareUrl={shareUrl}
      />
    </div>
  );
}
