import { DataTable } from "@/components/elements/DataTable";
import SearchInput from "@/components/elements/SearchInput";
import DasboardLayout from "@/components/layout/DasboardLayout";
import { Button } from "@/components/ui/button";
import { debounce } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const columns = [
  {
    accessorKey: "emailId",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [loading] = useState(false);

  console.log(searchParams.get("query") || "");

  const data = [
    {
      id: "728ed52f",
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "32e",
      status: "pending",
      email: "m@example.com",
    },
  ];

  const debouncedSetSearchParams = useMemo(
    () =>
      debounce((value) => {
        setSearchParams((params) => {
          params.set("query", value);
          return params;
        });
      }, 500),
    [setSearchParams]
  );

  const handleSearchInput = (value: string) => {
    setQuery(value);
    debouncedSetSearchParams(value);
  };

  return (
    <DasboardLayout>
      <h1 className="text-2xl font-semibold mb-6">Your Campaigns</h1>
      <div className="flex flex-row items-center justify-between">
        <SearchInput query={query} setQuery={handleSearchInput} />
        {/* using math.random on key will not persist the previously enter data in the modal -- Mitej Madan  */}
        <Button
          size={"sm"}
          // onClick={() => setOpen(<CreateBoard key={Math.random()} />)}
        >
          Create Campaign
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        DataEmptyComponent={() => <></>}
      />
      {/* <div className="flex h-[25rem] flex-col items-center justify-center">
        <h1 className="text-xl font-semibold">Oops !!! No campaign Found.</h1>
        <p className="text-sm text-slate-600 my-2 mb-4">
          Press the "Create Campaign" button to create your first campaign
        </p>
      </div> */}
    </DasboardLayout>
  );
};

export default Dashboard;
