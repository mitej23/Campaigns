import { DataTable } from "@/components/elements/DataTable";
import DasboardLayout from "@/components/layout/DasboardLayout";
import { Button } from "@/components/ui/button";
import useGetQuery from "@/hooks/useGetQuery";
import { columns } from "./EmailTemplate.columns";
import { useNavigate } from "react-router-dom";

const DataEmptyComponent = () => {
  return (
    <div className="flex h-[25rem] flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">
        Oops !!! No Email Templates Found.
      </h1>
      <p className="text-sm text-slate-600 my-2 mb-4">
        Press the "Add Email Template" button to create your first account
      </p>
    </div>
  );
};

const EmailTemplate = () => {
  const navigate = useNavigate();
  const { data, isPending } = useGetQuery(
    "/api/email-template",
    "",
    "emailTemplates"
  );

  return (
    <DasboardLayout>
      <div className="flex flex-row items-end justify-between mb-4">
        <h1 className="text-2xl font-semibold">Your Email Templates</h1>
        <Button size={"sm"} onClick={() => navigate("/email-templates/create")}>
          Add Email Template
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.data}
        loading={isPending}
        filterPlaceholder="Filter Templates..."
        DataEmptyComponent={DataEmptyComponent}
      />
    </DasboardLayout>
  );
};

export default EmailTemplate;
