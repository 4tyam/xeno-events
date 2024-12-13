import { ReactNode } from "react";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CreateEventLayoutProps {
  children: ReactNode;
  onSubmit: () => void;
}

export default function CreateEventLayout({
  children,
  onSubmit,
}: CreateEventLayoutProps) {
  return (
    <div>
      {children}
      <CardFooter>
        <Button
          onClick={onSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Create Event
        </Button>
      </CardFooter>
    </div>
  );
}
