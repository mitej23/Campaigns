import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import { Loader } from "lucide-react";
// import { toast } from "@/hooks/use-toast";
// import { queryClient } from "@/App";
import { DataTable } from "@/components/elements/DataTable";
import { columns } from "./AddContactToCampaign.columns";
import useGetQuery from "@/hooks/useGetQuery";

const DataEmptyComponent = () => {
  return (
    <div className="flex h-[20rem] flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">Oops !!! No Contact Found.</h1>
      <p className="text-sm text-slate-600 my-2 mb-4">
        Press the "Add Contacts" button to create your first account
      </p>
    </div>
  );
};

const AddContactsToCampaign: React.FC = () => {
  const { data, isPending } = useGetQuery("/api/contacts", "", "contacts");
  const { isOpen, setClose } = useModal();

  const handleAddContactsToCampaign = () => {
    // mutate(
    //   {
    //     // name,
    //     // email: emailAccount,
    //   },
    //   {
    //     onSuccess: () => {
    //       toast({
    //         title: "Contact added your list Successfully.",
    //         description: "You would be able to send email to this contact.",
    //       });
    //       setClose();
    //       queryClient.invalidateQueries({
    //         queryKey: ["contacts"],
    //       });
    //     },
    //     onError: () => {
    //       toast({
    //         title: "Oops!! Email Account already exists",
    //         description: "Enter different email id..",
    //       });
    //     },
    //   }
    // );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contact To Campaign</DialogTitle>
          <DialogDescription>
            Select the users from your contact list to add to this campaign.
          </DialogDescription>
        </DialogHeader>
        <DataTable
          columns={columns}
          data={data?.data}
          loading={isPending}
          DataEmptyComponent={DataEmptyComponent}
          isSelection={true}
          paginationCount={4}
        />
        <DialogFooter>
          <Button
            size={"sm"}
            type="submit"
            onClick={handleAddContactsToCampaign}>
            {isPending ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              "Add Contacts"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactsToCampaign;
