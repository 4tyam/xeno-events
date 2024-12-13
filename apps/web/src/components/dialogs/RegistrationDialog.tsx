import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RegistrationDialogProps {
  isOpen: boolean;
  eventName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function RegistrationDialog({
  isOpen,
  eventName,
  onOpenChange,
  onConfirm,
}: RegistrationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-sm rounded-xl bg-[#F9F9F8] [&>button]:hidden">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center">
            Confirm Registration
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            You are about to register for
            <span className="text-black text-lg font-semibold block pt-3">
              {eventName}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between space-x-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Go Back
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
