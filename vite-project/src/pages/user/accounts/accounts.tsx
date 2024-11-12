import { DataTable } from "@/components/elements/DataTable";
import DasboardLayout from "@/components/layout/DasboardLayout";
import { Button } from "@/components/ui/button";
import useGetQuery from "@/hooks/useGetQuery";
import { columns } from "./Accounts.columns";
import CreateAccount from "./CreateAccounts.dialog";
import { useModal } from "@/hooks/useModal";

const DataEmptyComponent = () => {
  return (
    <div className="flex h-[25rem] flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">Oops !!! No Accounts Found.</h1>
      <p className="text-sm text-slate-600 my-2 mb-4">
        Press the "Add Email Accounts" button to create your first account
      </p>
    </div>
  );
};

const Accounts = () => {
  const { data, isPending } = useGetQuery(
    "/api/user-email-accounts/check-email-statuses",
    "",
    "emailAccounts"
  );
  const { setOpen } = useModal();

  return (
    <DasboardLayout>
      <div className="flex flex-row items-end justify-between mb-4">
        <h1 className="text-2xl font-semibold">Your Email Accounts</h1>
        <Button
          size={"sm"}
          onClick={() => setOpen(<CreateAccount key={Math.random()} />)}>
          Add Email Accounts
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.accounts || []}
        loading={isPending}
        filterPlaceholder="Filter Accounts..."
        DataEmptyComponent={DataEmptyComponent}
      />
    </DasboardLayout>
  );
};

export default Accounts;
