import useGetQuery from "@/hooks/useGetQuery";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EditorMainContainer from "./editor/EditorMainContainer";

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
      <EditorMainContainer
        campaignName={campaignData?.name}
        campaignId={id}
        automationFlowEditorData={campaignData?.automationFlowEditorData}
      />
    </div>
  );
};

export default AutomationBuilderEditor;
