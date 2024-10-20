import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/useModal";
import { useState } from "react";
import usePostQuery from "@/hooks/usePostQuery";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/App";

const CreateContact: React.FC = () => {
  const { mutate, isPending } = usePostQuery("/api/contacts/add-contact");
  const [name, setName] = useState("");
  const [emailAccount, setEmailAccount] = useState("");
  const { isOpen, setClose } = useModal();

  const handleCreateContact = () => {
    if (emailAccount === "" || name === "") return;

    mutate(
      {
        name,
        email: emailAccount,
      },
      {
        onSuccess: () => {
          toast({
            title: "Contact added your list Successfully.",
            description: "You would be able to send email to this contact.",
          });
          setClose();
          queryClient.invalidateQueries({
            queryKey: ["contacts"],
          });
        },
        onError: () => {
          toast({
            title: "Oops!! Email Account already exists",
            description: "Enter different email id..",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
          <DialogDescription>
            Enter name and email-id of your contact. Later you would be able to
            send email to this contact.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-baseline justify-start gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter contact's name..."
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-baseline justify-start gap-4">
            <Label htmlFor="name" className="text-right">
              Email Id
            </Label>
            <Input
              id="name"
              placeholder="Enter your email..."
              className="col-span-3"
              value={emailAccount}
              onChange={(e) => setEmailAccount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            size={"sm"}
            type="submit"
            disabled={!emailAccount || !name ? true : false}
            onClick={handleCreateContact}>
            {isPending ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              "Create Contact"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContact;
