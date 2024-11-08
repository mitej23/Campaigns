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
import { useState } from "react";
import usePostQuery from "@/hooks/usePostQuery";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/App";

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

const AddContactsToCampaign: React.FC<{
  id: string;
  disableRowWithThisData: string[];
}> = ({ id, disableRowWithThisData }) => {
  const [rowSelection, setRowSelection] = useState({});
  const { mutate, isPending: loading } = usePostQuery(
    "/api/campaigns/add-some-contact"
  );
  const { data, isPending } = useGetQuery("/api/contacts", "", "contacts");
  const { isOpen, setClose } = useModal();

  const handleAddContactsToCampaign = () => {
    mutate(
      {
        contactIds: Object.keys(rowSelection),
        campaignId: id,
      },
      {
        onSuccess: () => {
          toast({
            title: "Contact added your list Successfully.",
            description: "You would be able to send email to this contact.",
          });
          setClose();
          setRowSelection({});
          queryClient.invalidateQueries({
            queryKey: ["campaign-details", id],
          });
        },
        onError: () => {
          toast({
            title: "Oops!! There was some issue",
            description: "Try again later..",
          });
        },
      }
    );
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
          filterPlaceholder="Filter Contacts..."
          DataEmptyComponent={DataEmptyComponent}
          isSelection={true}
          paginationCount={4}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          disableRowWithThisData={disableRowWithThisData}
        />
        <DialogFooter>
          <Button
            size={"sm"}
            type="submit"
            onClick={handleAddContactsToCampaign}>
            {loading ? (
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
