import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface SignInFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignIn: (email: string) => Promise<void>;
  onSwitchToSignUp: () => void;
  isLoading?: boolean;
}

export function SignInForm({
  open,
  onOpenChange,
  onSignIn,
  onSwitchToSignUp,
  isLoading,
}: SignInFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    await onSignIn(email);
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
              <DialogTitle className="text-center">Welcome back</DialogTitle>
              <DialogDescription className="text-center">
                Enter your credentials to login to your account.
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
                <Label htmlFor="login-email">Email</Label>
                <Input
                  className="placeholder:text-sm"
                  id="login-email"
                  name="email"
                  placeholder="hi@yourcompany.com"
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  className="placeholder:text-sm"
                  id="login-password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Button variant="link" className="h-auto p-0 text-xs">
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
