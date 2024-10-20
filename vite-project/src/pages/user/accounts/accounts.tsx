import { DataTable } from "@/components/elements/DataTable";
import DasboardLayout from "@/components/layout/DasboardLayout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGetQuery from "@/hooks/useGetQuery";
import { MoreHorizontal, Trash2 } from "lucide-react";

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

const columns = [
  {
    accessorKey: "emailId",
    header: "Email Account",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <>
          {status === "Pending" ? (
            <p className="text-yellow-500 bg-yellow-100 py-1 px-2 rounded-full w-max text-xs font-semibold border border-yellow-500 ">
              {status}
            </p>
          ) : (
            <p className="text-green-500 bg-green-100 py-1 px-2 rounded-full w-max text-xs font-semibold border border-green-500 ">
              {status}
            </p>
          )}
        </>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Accounts = () => {
  const { data, isPending } = useGetQuery(
    "/api/user-email-accounts/check-email-statuses",
    "",
    "emailAccounts"
  );

  return (
    <DasboardLayout>
      <div className="flex flex-row items-end justify-between">
        <h1 className="text-2xl font-semibold">Your Email Accounts</h1>
        <Button
          size={"sm"}
          // onClick={() => setOpen(<CreateBoard key={Math.random()} />)}
        >
          Add Email Accounts
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.accounts}
        loading={isPending}
        DataEmptyComponent={DataEmptyComponent}
      />
    </DasboardLayout>
  );
};

export default Accounts;
