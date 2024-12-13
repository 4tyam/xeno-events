"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  SearchIcon,
  ListFilterIcon,
  LogInIcon,
  UserMinusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UserIcon,
  CalendarIcon,
  DownloadIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { utils as xlsxUtils, writeFile as xlsxWriteFile } from "xlsx";

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  imageUrl?: string;
  dateAdded: string;
  checkInTime?: string;
  isApproved?: boolean;
}

type SortDirection = "asc" | "desc";

export default function Attendees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(
    null
  );
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [sortBy, setSortBy] = useState<
    "name" | "dateRegistered" | "dateCheckedIn" | null
  >(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const requiresApproval = true;
  const eventName = "Xeno Event";
  const [attendeesList, setAttendeesList] = useState<Attendee[]>([
    {
      id: "1",
      name: "Florence Shaw",
      email: "florence@untitledui.com",
      phone: "+91 9898877676",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      checkInTime: "July 4, 2022\n4:30 PM",
      isApproved: !requiresApproval,
    },
    {
      id: "2",
      name: "Amélie Laurent",
      email: "amelie@untitledui.com",
      phone: "+91 5550000002",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      checkInTime: "July 4, 2022\n5:15 PM",
      isApproved: !requiresApproval,
    },
    {
      id: "3",
      name: "Ammar Foley",
      email: "ammar@untitledui.com",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      isApproved: !requiresApproval,
    },
    {
      id: "4",
      name: "Caitlyn Oconnor",
      email: "caitlyn@untitledui.com",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      isApproved: !requiresApproval,
    },
    {
      id: "5",
      name: "Sienna Hewitt",
      email: "sienna@untitledui.com",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      isApproved: !requiresApproval,
    },
    {
      id: "6",
      name: "Olly Murs",
      email: "olly@untitledui.com",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      isApproved: !requiresApproval,
    },
    {
      id: "7",
      name: "Mathilde Lemaire",
      email: "mathilde@untitledui.com",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      isApproved: !requiresApproval,
    },
    {
      id: "8",
      name: "Mathilde Lemaire",
      email: "mathilde@untitledui.com",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      isApproved: !requiresApproval,
    },
    {
      id: "9",
      name: "Mathilde Lemaire",
      email: "mathilde@untitledui.com",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      isApproved: !requiresApproval,
    },
    {
      id: "10",
      name: "Mathilde Lemaire",
      email: "mathilde@untitledui.com",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      isApproved: !requiresApproval,
    },
    {
      id: "11",
      name: "Mathilde Lemaire",
      email: "mathilde@untitledui.com",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      isApproved: !requiresApproval,
    },
    {
      id: "12",
      name: "Mathilde Lemaire",
      email: "mathilde@untitledui.com",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      isApproved: !requiresApproval,
    },
    {
      id: "13",
      name: "Mathilde Lemaire",
      email: "mathilde@untitledui.com",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      isApproved: !requiresApproval,
    },
    {
      id: "14",
      name: "Mathilde Lemaire",
      email: "mathilde@untitledui.com",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      isApproved: !requiresApproval,
    },
    {
      id: "15",
      name: "Mathilde Lemaire",
      email: "mathilde@untitledui.com",
      imageUrl: "/image-placeholder.jpeg",
      dateAdded: "July 4, 2022",
      isApproved: !requiresApproval,
    },
  ]);

  const handleRemoveAttendee = () => {
    console.log("Removing attendee:", selectedAttendee?.id);
    setShowRemoveDialog(false);
    setSelectedAttendee(null);
  };

  const handleApproval = (attendee: Attendee) => {
    setSelectedAttendee(attendee);
    setShowApprovalDialog(true);
  };

  const confirmApproval = () => {
    if (selectedAttendee) {
      setAttendeesList(
        attendeesList.map((a) =>
          a.id === selectedAttendee.id ? { ...a, isApproved: true } : a
        )
      );
      setShowApprovalDialog(false);
      setSelectedAttendee(null);
    }
  };

  const AttendeeMenu = ({ attendee }: { attendee: Attendee }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setSelectedAttendee(attendee);
            setShowRemoveDialog(true);
          }}
        >
          <UserMinusIcon className="h-4 w-4" />
          Remove attendee
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl  px-2 sm:px-4 flex flex-col h-[560px]">
        <div className="p-4 sm:p-6 pb-0">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between sm:hidden">
              <h2 className="text-2xl font-semibold tracking-tighter">
                Total registrants:
                <span className="text-muted-foreground ml-2">
                  {attendeesList.length}
                </span>
                {requiresApproval && (
                  <div className="text-sm font-normal mt-1">
                    Approved registrants:
                    <span className="ml-1">
                      {attendeesList.filter((a) => a.isApproved).length}
                    </span>
                  </div>
                )}
              </h2>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="hidden sm:flex flex-col gap-1">
                <h2 className="text-xl font-semibold tracking-tighter">
                  Total registrants:
                  <span className="text-muted-foreground ml-2">
                    {attendeesList.length}
                  </span>
                </h2>
                {requiresApproval && (
                  <h3 className="text-sm tracking-tight text-muted-foreground">
                    Approved registrants:
                    <span className="ml-1">
                      {attendeesList.filter((a) => a.isApproved).length}
                    </span>
                  </h3>
                )}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:space-x-3">
                <div className="relative w-full sm:w-[275px]">
                  <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-8 pr-24 placeholder:text-xs sm:placeholder:text-sm"
                    placeholder="Search people..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          console.log("Searching for:", searchQuery);
                        }}
                      >
                        <span className="truncate">Search</span>
                        <LogInIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex justify-end sm:justify-start w-full sm:w-auto pb-4 sm:pb-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-1/3 sm:w-auto">
                        <ListFilterIcon className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuItem
                        className="text-xs"
                        onClick={() => {
                          if (sortBy === "name") {
                            setSortDirection(
                              sortDirection === "asc" ? "desc" : "asc"
                            );
                          } else {
                            setSortBy("name");
                            setSortDirection("asc");
                          }
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            <span>By name</span>
                          </div>
                          {sortBy === "name" &&
                            (sortDirection === "asc" ? (
                              <ArrowUpIcon className="h-4 w-4 ml-2" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4 ml-2" />
                            ))}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-xs"
                        onClick={() => {
                          if (sortBy === "dateRegistered") {
                            setSortDirection(
                              sortDirection === "asc" ? "desc" : "asc"
                            );
                          } else {
                            setSortBy("dateRegistered");
                            setSortDirection("asc");
                          }
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>By date registered</span>
                          </div>
                          {sortBy === "dateRegistered" &&
                            (sortDirection === "asc" ? (
                              <ArrowUpIcon className="h-4 w-4 ml-2" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4 ml-2" />
                            ))}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-xs"
                        onClick={() => {
                          if (sortBy === "dateCheckedIn") {
                            setSortDirection(
                              sortDirection === "asc" ? "desc" : "asc"
                            );
                          } else {
                            setSortBy("dateCheckedIn");
                            setSortDirection("asc");
                          }
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <LogInIcon className="h-4 w-4" />
                            <span>By date checked in</span>
                          </div>
                          {sortBy === "dateCheckedIn" &&
                            (sortDirection === "asc" ? (
                              <ArrowUpIcon className="h-4 w-4 ml-2" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4 ml-2" />
                            ))}
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    className="w-1/3 sm:w-auto ml-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      const worksheet = xlsxUtils.json_to_sheet(
                        attendeesList.map((a) => ({
                          Name: a.name,
                          Email: a.email,
                          Phone: a.phone || "Not provided",
                          "Date Registered": a.dateAdded,
                          "Check In Time": a.checkInTime || "Not checked in",
                        }))
                      );
                      const workbook = xlsxUtils.book_new();
                      xlsxUtils.book_append_sheet(
                        workbook,
                        worksheet,
                        "Attendees"
                      );
                      xlsxWriteFile(
                        workbook,
                        `${eventName} attendees list.xlsx`
                      );
                    }}
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:block flex-1 overflow-auto pb-4">
          <Table>
            <TableHeader className="bg-gray-100/85">
              <TableRow>
                <TableHead className="w-12 py-1">
                  <Checkbox />
                </TableHead>
                <TableHead className="py-1">Attendee</TableHead>
                <TableHead className="py-1">Phone</TableHead>
                {requiresApproval && (
                  <TableHead className="py-1">Approval</TableHead>
                )}
                <TableHead className="py-1">Date registered</TableHead>
                <TableHead className="py-1">Check-in time</TableHead>

                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendeesList
                .sort((a, b) => {
                  if (sortBy === "name") {
                    return sortDirection === "asc"
                      ? a.name.localeCompare(b.name)
                      : b.name.localeCompare(a.name);
                  } else if (sortBy === "dateRegistered") {
                    return sortDirection === "asc"
                      ? a.dateAdded.localeCompare(b.dateAdded)
                      : b.dateAdded.localeCompare(a.dateAdded);
                  } else if (sortBy === "dateCheckedIn") {
                    return sortDirection === "asc"
                      ? (a.checkInTime || "").localeCompare(b.checkInTime || "")
                      : (b.checkInTime || "").localeCompare(
                          a.checkInTime || ""
                        );
                  } else {
                    return 0;
                  }
                })
                .map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell className="py-4">
                      <Checkbox />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            className=" rounded-full aspect-square object-cover"
                            src={attendee.imageUrl}
                          />
                          <AvatarFallback>
                            {attendee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{attendee.name}</span>
                          <span className="text-sm text-gray-500">
                            {attendee.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {attendee.phone || "Not provided"}
                    </TableCell>
                    {requiresApproval && (
                      <TableCell className="py-4">
                        <Checkbox
                          className="disabled:opacity-75 disabled:border-none"
                          checked={attendee.isApproved}
                          disabled={attendee.isApproved}
                          onCheckedChange={() => handleApproval(attendee)}
                        />
                      </TableCell>
                    )}
                    <TableCell className="py-4">{attendee.dateAdded}</TableCell>
                    <TableCell className="py-4">
                      {attendee.checkInTime ? (
                        <div className="flex flex-col">
                          <span>{attendee.checkInTime.split("\n")[0]}</span>
                          <span className="text-sm text-gray-500">
                            {attendee.checkInTime.split("\n")[1]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Not checked in</span>
                      )}
                    </TableCell>

                    <TableCell className="py-4">
                      <AttendeeMenu attendee={attendee} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-4 sm:hidden flex-1 overflow-auto px-4 py-2 pb-6">
          {attendeesList
            .sort((a, b) => {
              if (sortBy === "name") {
                return sortDirection === "asc"
                  ? a.name.localeCompare(b.name)
                  : b.name.localeCompare(a.name);
              } else if (sortBy === "dateRegistered") {
                return sortDirection === "asc"
                  ? a.dateAdded.localeCompare(b.dateAdded)
                  : b.dateAdded.localeCompare(a.dateAdded);
              } else if (sortBy === "dateCheckedIn") {
                return sortDirection === "asc"
                  ? (a.checkInTime || "").localeCompare(b.checkInTime || "")
                  : (b.checkInTime || "").localeCompare(a.checkInTime || "");
              } else {
                return 0;
              }
            })
            .map((attendee) => (
              <div
                key={attendee.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={attendee.imageUrl} />
                    <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{attendee.name}</div>
                    <div className="text-sm text-gray-500">
                      {attendee.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {attendee.phone || "Phone: Not provided"}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Registered: {attendee.dateAdded}
                    </div>
                    <div className="text-sm text-gray-500">
                      {attendee.checkInTime ? (
                        <>Check-in: {attendee.checkInTime.replace("\n", " ")}</>
                      ) : (
                        "Not checked in"
                      )}
                    </div>
                  </div>
                </div>
                <AttendeeMenu attendee={attendee} />
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-center py-2 pb-10">
        <Pagination>
          <PaginationContent className="flex-wrap justify-center gap-2">
            <PaginationItem>
              <PaginationPrevious href="#" className="hidden sm:flex" />
              <PaginationPrevious href="#" className="sm:hidden">
                Previous
              </PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem className="hidden sm:block">
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem className="hidden sm:block">
              <PaginationLink href="#">5</PaginationLink>
            </PaginationItem>
            <PaginationItem className="hidden sm:block">
              <PaginationLink href="#">6</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" className="hidden sm:flex" />
              <PaginationNext href="#" className="sm:hidden">
                Next
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent className="max-w-xs sm:max-w-md rounded-xl bg-[#F9F9F8] [&>button]:hidden">
          <DialogHeader className="text-center">
            <DialogTitle>Remove Attendee</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this attendee? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedAttendee && (
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedAttendee.imageUrl} />
                <AvatarFallback>
                  {selectedAttendee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{selectedAttendee.name}</span>
                <span className="text-sm text-gray-500">
                  {selectedAttendee.email}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row items-center justify-end gap-x-3 sm:gap-x-1">
            <Button
              variant="outline"
              onClick={() => setShowRemoveDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveAttendee}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-xs sm:max-w-md rounded-xl bg-[#F9F9F8] [&>button]:hidden">
          <DialogHeader className="text-center">
            <DialogTitle>Approve Attendee</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this attendee? You cannot
              unapprove an attendee after approving them
            </DialogDescription>
          </DialogHeader>

          {selectedAttendee && (
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedAttendee.imageUrl} />
                <AvatarFallback>
                  {selectedAttendee.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{selectedAttendee.name}</span>
                <span className="text-sm text-gray-500">
                  {selectedAttendee.email}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-row items-center justify-end gap-x-3 sm:gap-x-1">
            <Button
              variant="outline"
              onClick={() => setShowApprovalDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApproval}
              className="bg-blue-500 hover:bg-blue-600 "
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
