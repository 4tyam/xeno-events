"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Mail, Phone, CircleAlert } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [deleteInput, setDeleteInput] = useState("");
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`/api/user/delete`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Account Settings
        </h2>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Manage your account preferences and settings
        </p>
      </div>

      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-xl tracking-tight font-semibold">
            Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage
                    src="/image-placeholder.jpeg"
                    alt="Profile picture"
                    className="rounded-full aspect-square object-cover"
                    draggable={false}
                  />
                  <AvatarFallback className="text-2xl">UN</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full h-10 w-10"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <Badge variant="secondary">Joined Dec 2023</Badge>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="placeholder:text-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  className="placeholder:text-sm"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="flex justify-end">
                <Button variant="xeno" className="w-full sm:w-fit">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none border-none">
        <CardContent className="p-6">
          <h3 className="text-xl tracking-tight font-semibold">
            Delete Account
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </p>
          <Separator className="my-4" />

          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-[34px]" variant="destructive">
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xs sm:max-w-sm rounded-xl bg-[#F9F9F8] [&>button]:hidden">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50"
                  aria-hidden="true"
                >
                  <CircleAlert
                    className="text-red-600"
                    size={16}
                    strokeWidth={2}
                  />
                </div>
                <DialogHeader>
                  <DialogTitle className="sm:text-center">
                    Delete Account
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
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                  />
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
                    disabled={deleteInput !== "delete"}
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
