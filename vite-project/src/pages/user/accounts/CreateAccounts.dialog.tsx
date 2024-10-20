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

const CreateAccount: React.FC = () => {
  const { mutate, isPending } = usePostQuery("/api/user-email-accounts/add");
  const [emailAccount, setEmailAccount] = useState("");
  const { isOpen, setClose } = useModal();

  const handleCreateAccount = () => {
    if (emailAccount === "") return;

    mutate(
      {
        emailId: emailAccount,
      },
      {
        onSuccess: () => {
          toast({
            title: "Verication Email sent Successfully.",
            description: "You will receive verification email from aws ses.",
          });
          setClose();
          queryClient.invalidateQueries({
            queryKey: ["emailAccounts"],
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
          <DialogTitle>Add Email Account</DialogTitle>
          <DialogDescription>
            Enter your email account Id. A verification email would be sent to
            this account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
            disabled={!emailAccount ? true : false}
            onClick={handleCreateAccount}>
            {isPending ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              "Create Email Account"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccount;
