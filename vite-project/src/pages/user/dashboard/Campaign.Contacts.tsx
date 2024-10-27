import { Button } from "@/components/ui/button";
import AddContactsToCampaign from "./AddContactsToCampaign.modal";
import { useModal } from "@/hooks/useModal";

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

const CampaignContacts = ({ data }) => {
  const { setOpen } = useModal();

  return (
    <>
      <div className="flex items-end">
        <Button
          size={"sm"}
          type="submit"
          className="w-max ml-auto"
          onClick={() => setOpen(<AddContactsToCampaign />)}>
          Add Contacts
        </Button>
      </div>
      <div>{data.length > 0 ? <></> : <DataEmptyComponent />}</div>
    </>
  );
};

export default CampaignContacts;
