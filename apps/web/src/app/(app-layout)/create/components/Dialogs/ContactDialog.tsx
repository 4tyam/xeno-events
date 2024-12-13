import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface ContactDialogProps {
  isOpen: boolean;
  contacts: ContactPerson[];
  onOpenChange: (open: boolean) => void;
  onContactsChange: (contacts: ContactPerson[]) => void;
}

export default function ContactDialog({
  isOpen,
  contacts,
  onOpenChange,
  onContactsChange,
}: ContactDialogProps) {
  const handleContactChange = (
    index: number,
    field: keyof ContactPerson,
    value: string
  ) => {
    const newContacts = [...contacts];
    newContacts[index] = {
      ...newContacts[index],
      [field]: value,
    };
    onContactsChange(newContacts);
  };

  const handleAddContact = () => {
    if (contacts.length < 4) {
      onContactsChange([
        ...contacts,
        {
          id: Math.random().toString(),
          name: "",
          email: "",
          phone: "",
        },
      ]);
    }
  };

  const handleRemoveContact = (id: string) => {
    onContactsChange(contacts.filter((c) => c.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="top-[50%] mx-auto max-w-xs translate-y-[-50%] rounded-xl bg-[#F9F9F8] sm:max-w-sm [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-center">Contact Details</DialogTitle>
          <DialogDescription hidden>
            Enter the contact details for your event
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
          <p className="text-xs text-muted-foreground">
            Add up to 4 contact persons for the event (min 1).
          </p>

          {contacts.map((contact, index) => (
            <div key={contact.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="tracking-tighter">
                  Contact Person {index + 1}
                </Label>
                {contacts.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveContact(contact.id)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid gap-2">
                <Input
                  className="h-8 border-none bg-gray-50/90 text-xs shadow-none placeholder:text-xs sm:h-10 sm:text-sm sm:placeholder:text-sm"
                  placeholder="Name"
                  value={contact.name}
                  onChange={(e) =>
                    handleContactChange(index, "name", e.target.value)
                  }
                />
                <Input
                  className="h-8 border-none bg-gray-50/90 text-xs shadow-none placeholder:text-xs sm:h-10 sm:text-sm sm:placeholder:text-sm"
                  type="email"
                  placeholder="Email"
                  value={contact.email}
                  onChange={(e) =>
                    handleContactChange(index, "email", e.target.value)
                  }
                />
                <Input
                  className="h-8 border-none bg-gray-50/90 text-xs shadow-none placeholder:text-xs sm:h-10 sm:text-sm sm:placeholder:text-sm"
                  type="tel"
                  placeholder="Phone"
                  value={contact.phone}
                  onChange={(e) =>
                    handleContactChange(index, "phone", e.target.value)
                  }
                />
              </div>
            </div>
          ))}

          {contacts.length < 4 && (
            <Button
              type="button"
              variant="outline"
              className="h-8 w-full sm:h-10"
              onClick={handleAddContact}
            >
              Add Another Contact
            </Button>
          )}

          <div className="flex items-center justify-between space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (contacts.some((c) => c.name)) {
                  onOpenChange(false);
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
