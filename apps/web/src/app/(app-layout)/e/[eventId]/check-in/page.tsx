"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Users, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { QRScanner } from "@/components/QrScanner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CheckInRecord {
  id: string;
  attendeeName: string;
  email: string;
  timestamp: string;
  status: "success" | "failed";
}

interface ScannedAttendee {
  name: string;
  email: string;
  ticketType: string;
  ticketId: string;
}

export const DUMMY_USERS = [
  {
    id: "1",
    name: "Florence Shaw",
    email: "florence@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
  {
    id: "2",
    name: "Amélie Laurent",
    email: "amelie@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
  {
    id: "3",
    name: "Ammar Foley",
    email: "ammar@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
  {
    id: "4",
    name: "Caitlyn King",
    email: "caitlyn@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
  {
    id: "5",
    name: "Sienna Hewitt",
    email: "sienna@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
  {
    id: "6",
    name: "Olly Shroeder",
    email: "olly@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
  {
    id: "7",
    name: "Mathilgfde Lewis",
    email: "reddy@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
  {
    id: "8",
    name: "Math54eilde Lewis",
    email: "mathilde@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
  {
    id: "9",
    name: "Mathfredilde Lewis",
    email: "mathilde@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
  {
    id: "10",
    name: "Mathiwdwdwdxlde Lewis",
    email: "mathilde@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
  {
    id: "11",
    name: "Mathiwdwdwlde Lewis",
    email: "mathilde@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
  {
    id: "12",
    name: "Mathiwd2wdwlde Lewis",
    email: "mathilde@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
  {
    id: "13",
    name: "Mathsssilde Lewis",
    email: "mathilde@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
  {
    id: "14",
    name: "Mathsilde Lewis",
    email: "mathilde@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
  {
    id: "15",
    name: "Mathilsde Lewis",
    email: "mathilde@untitledui.com",
    imageUrl: "/image-placeholder.jpeg",
    dateRegistered: "July 4, 2022",
  },
];

export default function CheckInPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [checkInHistory, setCheckInHistory] = useState<CheckInRecord[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scannedAttendee, setScannedAttendee] =
    useState<ScannedAttendee | null>(null);
  const [scannerResetKey, setScannerResetKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const checkedInCount = checkInHistory.filter(
    (record) => record.status === "success"
  ).length;

  const handleScan = (scannedData: string) => {
    try {
      const matchedUser = DUMMY_USERS.find((user) => user.id === scannedData);

      if (!matchedUser) {
        toast.error("Invalid QR Code", {
          description: "This QR code does not match any registered attendee.",
          className:
            "bg-red-500 text-white border-0 outline-none shadow-none [&>div]:border-0 [&>div]:!outline-none [&>div]:!shadow-none",
        });
        return;
      }

      const attendeeData: ScannedAttendee = {
        name: matchedUser.name,
        email: matchedUser.email,
        ticketType: "General Admission",
        ticketId: matchedUser.id,
      };

      setScannedAttendee(attendeeData);
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Error processing QR code:", err);
      toast.error("Error", {
        description: "Failed to process QR code",
        className:
          "bg-rose-500 text-white border-0 outline-none shadow-none [&>div]:border-0 [&>div]:!outline-none [&>div]:!shadow-none",
      });
    }
  };

  const handleCheckIn = () => {
    if (!scannedAttendee) return;

    addToHistory({
      attendeeName: scannedAttendee.name,
      email: scannedAttendee.email,
      status: "success",
    });

    setIsDialogOpen(false);
    setScannedAttendee(null);
  };

  const addToHistory = ({
    attendeeName,
    email,
    status,
  }: {
    attendeeName: string;
    email: string;
    status: "success" | "failed";
  }) => {
    const newRecord: CheckInRecord = {
      id: Math.random().toString(36).substring(7),
      attendeeName,
      email,
      timestamp: new Date().toLocaleString(),
      status,
    };

    setCheckInHistory((prev) => [newRecord, ...prev]);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setScannedAttendee(null);
      setScannerResetKey((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {!isMounted ? (
        <div className="space-y-8">
          {/* Skeleton Header */}
          <div>
            <div className="text-center space-y-1">
              <div className="h-12 sm:h-14 w-72 sm:w-96 bg-muted rounded mx-auto pb-4" />
              <div className="h-4 w-48 bg-muted rounded mx-auto mt-4 mb-6" />
            </div>
          </div>

          {/* Skeleton Stats Card and Settings Button */}
          <div className="flex justify-between items-center">
            <Card className="flex items-center gap-6 p-2 w-fit shadow-none border-none">
              <div className="h-8 w-40 flex items-center gap-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-4 w-4 bg-muted rounded" />
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="h-8 w-40 flex items-center gap-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-4 w-4 bg-muted rounded" />
              </div>
            </Card>

            {/* Skeleton Settings Button */}
            <div className="h-9 w-36 bg-muted rounded-full" />
          </div>

          {/* Skeleton Scanner Card */}
          <Card className="h-[400px] animate-pulse">
            <CardHeader className="pb-4">
              <div className="h-6 w-32 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded mt-2" />
            </CardHeader>
          </Card>

          {/* Skeleton History Card */}
          <Card className="h-[400px] animate-pulse">
            <CardHeader className="pb-4">
              <div className="h-6 w-32 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded mt-2" />
            </CardHeader>
          </Card>
        </div>
      ) : (
        <>
          {/* Event Header */}
          <div>
            <div className="text-center space-y-1">
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
                Team Xeno Event
              </h2>
              <p className="text-sm sm:pt-2 pb-4 text-muted-foreground">
                Check in attendees for your event
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Stats Card and Settings Button */}
            <div className="flex justify-between items-center gap-4">
              <Card className="flex items-center gap-6 p-2  w-fit text-xs sm:text-sm sm:px-4 font-medium border-none">
                <div className="flex items-center gap-2">
                  <div className="h-8 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="pl-2 sm:pl-0">
                      Checked In:{" "}
                      <Badge className="rounded-full" variant="xenoSecondary">
                        {checkedInCount}
                      </Badge>
                    </span>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <div className="h-8 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="pl-2 sm:pl-0">
                      Total Attendees:{" "}
                      <Badge className="rounded-full" variant="xenoSecondary">
                        100
                      </Badge>
                    </span>
                  </div>
                </div>
              </Card>

              <Link
                href="/e/1/settings"
                className="bg-blue-600 rounded-full p-3.5 sm:px-4 sm:py-2 font-medium text-sm tracking-tight flex flex-row items-center justify-center gap-2 text-white hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="size-4" />
                <span className="hidden sm:block">Event Settings</span>
              </Link>
            </div>

            {/* Scanner Section */}
            {isMounted && (
              <QRScanner
                onScan={handleScan}
                resetTrigger={scannerResetKey}
                users={DUMMY_USERS}
              />
            )}

            {/* History Section */}
            <Card className="h-[400px] flex flex-col shadow-none border-none">
              <CardHeader className="pb-4 space-y-0">
                <CardTitle>Check-in History</CardTitle>
                <CardDescription className="pt-1 text-xs">
                  Recent check-in activity
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <ScrollArea className="h-[300px] rounded-md" type="always">
                  <Table>
                    <TableHeader className="top-0 text-xs">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="bg-background sticky top-0 z-20">
                          Attendee
                        </TableHead>
                        <TableHead className="text-right bg-background sticky top-0 z-20 w-[150px] pr-6">
                          Time
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checkInHistory.map((record) => (
                        <TableRow
                          key={record.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="py-3 min-w-[100px] max-w-[200px]">
                            <div
                              className="font-medium truncate"
                              title={record.attendeeName}
                            >
                              {record.attendeeName}
                            </div>
                            <div
                              className="text-sm text-muted-foreground truncate"
                              title={record.email}
                            >
                              {record.email}
                            </div>
                          </TableCell>
                          <TableCell className="py-3 text-right text-muted-foreground w-[150px] shrink-0">
                            {record.timestamp}
                          </TableCell>
                        </TableRow>
                      ))}
                      {checkInHistory.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="h-[400px] text-center"
                          >
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <Users className="h-8 w-8" />
                              <p>No check-ins recorded yet</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
            <DialogContent className="max-w-xs sm:max-w-sm rounded-xl bg-[#F9F9F8] [&>button]:hidden">
              <DialogHeader>
                <DialogTitle className="text-center">
                  Confirm Check-in
                </DialogTitle>
                <DialogDescription className="text-center">
                  Please verify the attendee before checking in
                </DialogDescription>
              </DialogHeader>

              {scannedAttendee && (
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {scannedAttendee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{scannedAttendee.name}</span>
                    <span className="text-sm text-gray-500">
                      {scannedAttendee.email}
                    </span>
                  </div>
                </div>
              )}

              <DialogFooter className="flex flex-row items-center justify-end gap-x-3 sm:gap-x-1">
                <Button
                  variant="outline"
                  onClick={() => handleDialogChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCheckIn}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Check in
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
