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
import { useEffect, useState } from "react";
import usePostQuery from "@/hooks/usePostQuery";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/App";
import useGetQuery from "@/hooks/useGetQuery";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateCampaign: React.FC = () => {
  const { data, isPending: fetching } = useGetQuery(
    "/api/user-email-accounts/emails",
    "",
    "emails"
  );
  const { mutate, isPending } = usePostQuery("/api/campaigns/create-campaign");
  const [name, setName] = useState("");
  const [emailAccount, setEmailAccount] = useState("");
  const [emailSelectList, setEmailSelectList] = useState([]);
  const { isOpen, setClose } = useModal();

  const handleCreateCampaign = () => {
    if (emailAccount === "" || name === "") return;

    mutate(
      {
        name,
        emailAccountsId: emailAccount,
      },
      {
        onSuccess: () => {
          toast({
            title: "Campaign added Successfully.",
            description:
              "You would be able to create automation for your campaign.",
          });
          setClose();
          queryClient.invalidateQueries({
            queryKey: ["campaigns"],
          });
        },
        onError: () => {
          toast({
            title: "Oops!! Campaign already exists",
            description: "Enter different name..",
          });
        },
      }
    );
  };

  useEffect(() => {
    if (!fetching) {
      if (data?.data.length > 0) {
        setEmailSelectList(data.data);
      }
    }
  }, [fetching, data]);

  return (
    <Dialog open={isOpen} onOpenChange={setClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Campaign</DialogTitle>
          <DialogDescription>
            Enter name and select email-id for sending a campaign email.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-baseline justify-start gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter campaign name..."
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-baseline justify-start gap-4">
            <Label htmlFor="name" className="text-right">
              Email Id
            </Label>
            <Select onValueChange={(data) => setEmailAccount(data)}>
              <SelectTrigger className="col-span-3">
                <SelectValue
                  className="text-gray-600"
                  placeholder="Select an email"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {emailSelectList.map(({ id, emailId }) => (
                    <SelectItem key={id} value={id}>
                      {emailId}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            size={"sm"}
            type="submit"
            disabled={!emailAccount || !name ? true : false}
            onClick={handleCreateCampaign}>
            {isPending ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              "Create Campaign"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaign;
