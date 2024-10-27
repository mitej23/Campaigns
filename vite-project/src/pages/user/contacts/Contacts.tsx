import { DataTable } from "@/components/elements/DataTable";
import DasboardLayout from "@/components/layout/DasboardLayout";
import { Button } from "@/components/ui/button";
import useGetQuery from "@/hooks/useGetQuery";
import { useModal } from "@/hooks/useModal";
import { columns } from "./Contacts.columns";
import CreateAccount from "./CreateContact.dialog";

const DataEmptyComponent = () => {
  return (
    <div className="flex h-[25rem] flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">Oops !!! No Contact Found.</h1>
      <p className="text-sm text-slate-600 my-2 mb-4">
        Press the "Add Contacts" button to create your first account
      </p>
    </div>
  );
};

const Contacts = () => {
  const { data, isPending } = useGetQuery("/api/contacts", "", "contacts");
  const { setOpen } = useModal();

  return (
    <DasboardLayout>
      <div className="flex fleDataEmptyComponentx-row items-end justify-between mb-4">
        <h1 className="text-2xl font-semibold">Your Contact List</h1>
        <Button
          size={"sm"}
          onClick={() => setOpen(<CreateAccount key={Math.random()} />)}>
          Add Contact
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.data}
        loading={isPending}
        DataEmptyComponent={DataEmptyComponent}
      />
    </DasboardLayout>
  );
};

export default Contacts;
