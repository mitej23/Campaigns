import { Button } from "@/components/ui/button";
import AddContactsToCampaign from "./AddContactsToCampaign.modal";
import { useModal } from "@/hooks/useModal";
import { columns } from "./Campaign.Contacts.columns";
import { DataTable } from "@/components/elements/DataTable";

type Contact = {
  id: string;
  name: string;
  email: string;
};
const DataEmptyComponent: React.FC<{ campaignId: string }> = ({
  campaignId,
}) => {
  const { setOpen } = useModal();
  return (
    <div className="flex h-[20rem] flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">Oops !!! No Contact Found.</h1>
      <p className="text-sm text-slate-600 my-2 mb-4">
        Press the "Add Contacts" button to create your first account
      </p>
      <Button
        size={"sm"}
        type="submit"
        className="w-max"
        onClick={() =>
          setOpen(
            <AddContactsToCampaign
              id={campaignId}
              disableRowWithThisData={[]}
            />
          )
        }>
        Add Contacts
      </Button>
    </div>
  );
};

const CampaignContacts = ({
  data,
  campaignId,
}: {
  data: Contact[];
  campaignId: string;
}) => {
  const { setOpen } = useModal();

  return (
    <div className="pt-4">
      <DataTable
        columns={columns}
        data={data}
        loading={false}
        HeaderComponents={
          <Button
            size={"sm"}
            type="submit"
            className="w-max ml-auto"
            onClick={() =>
              setOpen(
                <AddContactsToCampaign
                  id={campaignId}
                  disableRowWithThisData={data.map(({ id }) => id)}
                />
              )
            }>
            Add Contacts
          </Button>
        }
        filterPlaceholder="Filter Contacts..."
        DataEmptyComponent={() => (
          <DataEmptyComponent campaignId={campaignId} />
        )}
      />
    </div>
  );
};

export default CampaignContacts;
