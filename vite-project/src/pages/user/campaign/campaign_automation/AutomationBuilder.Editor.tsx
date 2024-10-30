import { Separator } from "@/components/ui/separator";
import useGetQuery from "@/hooks/useGetQuery";
import { ChevronLeft, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

type Contact = {
  id: string;
  name: string;
  email: string;
};

type EmailAccount = {
  emailId: string;
};

type CampaignType = {
  id: string;
  name: string;
  status: string;
  contacts: Contact[];
  createdAt: string;
  emailAccount: EmailAccount;
  automationFlowEditorData: string | null;
};

const AutomationBuilderEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isPending } = useGetQuery(
    `/api/campaigns/${id}`,
    id || "",
    `campaign-details`
  );
  const [campaignData, setCampaignData] = useState<CampaignType | null>(null);

  useEffect(() => {
    if (!isPending) {
      if (data?.data) {
        setCampaignData(data.data);
      }
    }
  }, [isPending, data]);

  if (isPending) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader className="animate-spin" size={20} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex items-center justify-between px-6 py-3">
        <div
          className="flex items-center hover:cursor-pointer w-max"
          onClick={() => navigate("/dashboard")}>
          <ChevronLeft size={16} />
          <p className="ml-4 ">{campaignData?.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button size={"xs"} variant={"outline"}>
            Save
          </Button>
          <Button size={"xs"}>Publish</Button>
        </div>
      </div>
      <Separator />
      <div className="flex flex-row w-screen flex-1">
        <div className="h-full flex-1 bg-gray-100"></div>
        <Separator orientation="vertical" />
        <div className="h-full w-72"></div>
      </div>
    </div>
  );
};

export default AutomationBuilderEditor;
