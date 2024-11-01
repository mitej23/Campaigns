import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DataEmptyComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-[30rem] border rounded-md shadow-md flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">
        Oops !!! No Automation Flow Found.
      </h1>
      <p className="text-sm text-slate-600 my-2 mb-4">
        Press the below button to create your first account
      </p>
      <Button size={"sm"} onClick={() => navigate("editor")}>
        Create Automation Flow
      </Button>
    </div>
  );
};

const CampaignAutomationBuilder = ({
  automationFlowEditorData,
}: {
  automationFlowEditorData: string | null;
}) => {
  if (!automationFlowEditorData) return <DataEmptyComponent />;

  return <div>CampaignAutomationBuilder</div>;
};

export default CampaignAutomationBuilder;
