import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Label } from "../ui/label";

interface SignUpFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUp: (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => Promise<void>;
  onSwitchToSignIn: () => void;
  isLoading?: boolean;
}

export function SignUpForm({
  open,
  onOpenChange,
  onSignUp,
  onSwitchToSignIn,
  isLoading,
}: SignUpFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    await onSignUp(email, password, name, phone);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[50%] mx-auto max-w-xs translate-y-[-50%] rounded-xl bg-[#F9F9F8] sm:max-w-sm">
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/Xeno.svg"
              alt="Logo"
              width={100}
              height={100}
              draggable={false}
            />
            <DialogHeader>
              <DialogTitle className="text-center">Sign up</DialogTitle>
              <DialogDescription className="text-center">
                We just need a few details to get you started.
              </DialogDescription>
            </DialogHeader>
          </div>

          <Button variant="outline" className="w-full">
            <Image src="/Google.svg" alt="Google Logo" width={14} height={14} />
            Continue with Google
          </Button>

          <div className="flex items-center gap-2 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
            <span className="text-xs text-muted-foreground">or</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-0.5">
                <Label htmlFor="signup-name">Full name</Label>
                <Input
                  className="placeholder:text-sm"
                  id="signup-name"
                  name="name"
                  placeholder="Matt Welsh"
                  type="text"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  className="placeholder:text-sm"
                  id="signup-email"
                  name="email"
                  placeholder="hi@yourcompany.com"
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="signup-phone">Phone number</Label>
                <Input
                  className="placeholder:text-sm"
                  id="signup-phone"
                  name="phone"
                  placeholder="+91 9898877676"
                  type="tel"
                  required
                  autoComplete="tel"
                />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  className="placeholder:text-sm"
                  id="signup-password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </Button>
          </form>

          <div className="space-y-2 text-center text-xs">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
