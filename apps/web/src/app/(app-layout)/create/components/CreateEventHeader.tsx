/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateEventHeaderProps {
  // backgroundColor: string;
  // onColorDialogOpen: () => void;
  eventName: string;
  onEventNameChange: (name: string) => void;
}

export default function CreateEventHeader({
  // backgroundColor,
  // onColorDialogOpen,
  eventName,
  onEventNameChange,
}: CreateEventHeaderProps) {
  return (
    <>
      <div className="space-y-4">
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <img
            alt="Event preview"
            className="h-full w-full object-cover"
            src="/party.avif"
          />
          <Button
            className="absolute bottom-4 right-4"
            size="sm"
            variant="secondary"
          >
            Change Image
          </Button>
        </div>
        <div className="relative px-5">
          <div className="flex items-center gap-4">
            <Input
              className="h-auto flex-1 border-none bg-transparent px-0 !text-4xl font-semibold tracking-tight shadow-none hover:text-black/60 placeholder:text-black/25 hover:placeholder:text-black/30 dark:placeholder:text-white/30 sm:!text-5xl"
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => onEventNameChange(e.target.value)}
              autoFocus
            />
            {/* <button
              onClick={onColorDialogOpen}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-gray-50/90 p-2 transition-colors hover:bg-gray-50/90 sm:bg-gray-50/90"
            >
              <span className="hidden text-xs sm:inline">Theme</span>
              <div
                className="h-5 w-5 rounded-full transition-transform hover:scale-110"
                // style={{ backgroundColor }}
                title="Change background color"
              />
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
}
