import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CircleAlertIcon,
  UserPlusIcon,
  XIcon,
  UserMinusIcon,
  InfoIcon,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import InfoDialog from "@/components/dialogs/InfoDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: "creator" | "admin";
}

// Dummy creator data
const CREATOR: User = {
  id: "1",
  name: "Aditya Atyam",
  email: "atyam@gmail.com",
  image: "/image-placeholder.jpeg",
  role: "creator",
};

// Dummy data for admins and search results
const DUMMY_ADMINS: User[] = [
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    role: "admin",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    role: "admin",
  },
];

const DUMMY_USERS: User[] = [
  {
    id: "4",
    name: "Alice Johnson",
    email: "alice@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
  },
  {
    id: "5",
    name: "Bob Wilson",
    email: "bob@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
  },
  {
    id: "6",
    name: "Carol Brown",
    email: "carol@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
  },
];

export default function More() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [admins, setAdmins] = useState<User[]>(DUMMY_ADMINS);
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return DUMMY_USERS.filter(
      (user) =>
        !admins.some((admin) => admin.id === user.id) &&
        (user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query))
    );
  }, [searchQuery, admins]);

  const handleAddAdmin = (user: User) => {
    setSelectedUser(user);
    setShowAddDialog(true);
    setIsSearchOpen(false);
  };

  const confirmAddAdmin = () => {
    if (selectedUser) {
      setAdmins([...admins, { ...selectedUser, role: "admin" }]);
      setShowAddDialog(false);
      setSelectedUser(null);
      setSearchQuery("");
    }
  };

  const handleRemoveAdmin = () => {
    if (selectedAdmin) {
      setAdmins(admins.filter((admin) => admin.id !== selectedAdmin.id));
      setShowRemoveDialog(false);
      setSelectedAdmin(null);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/events");
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-4 tracking-tight">
        Additional Settings
      </h2>
      <Separator />
      <div className="space-y-6 pt-4">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl tracking-tight font-semibold flex items-center gap-2">
                Event Team
                <button
                  onClick={() => setShowInfoDialog(true)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <InfoIcon className="h-4 w-4" />
                </button>
              </h3>
            </div>

            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <Button className="ml-4 h-[34px] bg-blue-600 hover:bg-blue-700">
                  <UserPlusIcon className="size-3 sm:size-4" />
                  <span className="text-xs sm:text-sm">Add Admin</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {filteredUsers.map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => handleAddAdmin(user)}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.image} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="mt-3 space-y-3">
            {/* Creator */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    className="rounded-full aspect-square object-cover"
                    src={CREATOR.image}
                  />
                  <AvatarFallback>{CREATOR.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-sm font-medium">{CREATOR.name}</p>
                    <p className="text-xs text-gray-500">{CREATOR.email}</p>
                  </div>
                  <Badge variant="xeno" className="ml-2">
                    Creator
                  </Badge>
                </div>
              </div>
            </div>

            {/* Admins */}
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={admin.image} />
                    <AvatarFallback>{admin.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-sm font-medium">{admin.name}</p>
                      <p className="text-xs text-gray-500">{admin.email}</p>
                    </div>
                    <Badge variant="xenoSecondary" className="ml-2">
                      Admin
                    </Badge>
                  </div>
                </div>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setShowRemoveDialog(true);
                        }}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove admin</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>

          <InfoDialog
            heading="About Admins"
            text="An admin can manage the event, including editing details and managing attendees, but cannot delete the event."
            isOpen={showInfoDialog}
            onOpenChange={setShowInfoDialog}
          />

          <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
            <DialogContent className="max-w-xs rounded-xl bg-[#F9F9F8] [&>button]:hidden">
              <div className="flex flex-col items-center gap-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50">
                  <UserMinusIcon
                    className="text-red-600"
                    size={16}
                    strokeWidth={2}
                  />
                </div>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Remove Admin
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Are you sure you want to remove {selectedAdmin?.name} as an
                    admin? They will no longer be able to manage this event.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <DialogFooter className="flex flex-row sm:flex-row gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1"
                  onClick={handleRemoveAdmin}
                >
                  Remove Admin
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogContent className="max-w-xs rounded-xl bg-[#F9F9F8] [&>button]:hidden">
              <div className="flex flex-col items-center gap-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50">
                  <UserPlusIcon
                    className="text-blue-600"
                    size={16}
                    strokeWidth={2}
                  />
                </div>
                <DialogHeader>
                  <DialogTitle className="text-center">Add Admin</DialogTitle>
                  <DialogDescription className="text-center">
                    Are you sure you want to add {selectedUser?.name} as an
                    admin? They will be able to manage this event.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <DialogFooter className="flex flex-row sm:flex-row gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  type="button"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={confirmAddAdmin}
                >
                  Add Admin
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Separator className="mt-6 mb-5" />

          <h3 className="text-xl tracking-tight font-semibold">Delete Event</h3>
          <p className="text-gray-600 sm:text-sm text-xs mt-1">
            Cancel and permanently delete this event. This operation cannot be
            undone.
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4 h-[34px]" variant="destructive">
                Delete Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs sm:max-w-sm rounded-xl bg-[#F9F9F8] [&>button]:hidden">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50"
                  aria-hidden="true"
                >
                  <CircleAlertIcon
                    className="text-red-600"
                    size={16}
                    strokeWidth={2}
                  />
                </div>
                <DialogHeader>
                  <DialogTitle className="sm:text-center">
                    Delete Event
                  </DialogTitle>
                  <DialogDescription className="sm:text-center">
                    This action cannot be undone. To confirm, please type{" "}
                    <span className="font-medium text-foreground">delete</span>{" "}
                    below.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <form className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirmation</Label>
                  <Input
                    className="sm:text-sm placeholder:text-sm"
                    id="confirm"
                    type="text"
                    placeholder="Type 'delete' to confirm"
                    value={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.value)}
                  />
                </div>
                <DialogFooter className="flex flex-row sm:flex-row gap-2 sm:gap-0">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    disabled={confirmDelete !== "delete"}
                    type="button"
                    variant="destructive"
                    className="flex-1"
                    onClick={handleDeleteEvent}
                  >
                    Delete Event
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
