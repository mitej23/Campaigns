import { useEffect, useState } from "react";
import DasboardLayout from "@/components/layout/DasboardLayout";
import { ChevronLeft, Loader } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useGetQuery from "@/hooks/useGetQuery";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CampaignContacts from "./campaign_contacts/Campaign.Contacts";
import CampaignAutomationBuilder from "./campaign_automation/Campaign.AutomationBuilder.TabContainer";
import CampaignSettings from "./campaign_settings/Campaign.Settings";
import CampaignEmails from "./campaign_emails/Campaign.Emails";
import { Campaign as CampaignType } from "@/types/CampaignTypes";

type ContactsTypeDTO = {
  id: string;
  name: string;
  email: string;
};

const Campaign: React.FC = () => {
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

  const tabData = [
    {
      value: "emails",
      label: "Emails",
      content: (data: CampaignType) => (
        <CampaignEmails id={id} emails={data?.emails || []} />
      ),
    },
    {
      value: "contacts",
      label: "Contacts",
      content: (data: CampaignType) => {
        const modData = data?.campaignContacts.map((c) => {
          const container = {} as ContactsTypeDTO;
          container["id"] = c.id;
          container["name"] = c.user.name;
          container["email"] = c.user.email;

          return container;
        });

        return <CampaignContacts data={modData || []} campaignId={id || ""} />;
      },
    },
    {
      value: "automation_builder",
      label: "Automation Builder",
      content: (data: CampaignType) => (
        <CampaignAutomationBuilder
          automationFlowEditorData={data?.automationFlowEditorData}
        />
      ),
    },
    {
      value: "settings",
      label: "Settings",
      content: (data: CampaignType) => (
        <CampaignSettings
          name={data?.name}
          email={data?.emailAccount?.emailId}
        />
      ),
    },
  ];

  const getTabStyles = (tabStyle = "default") => {
    switch (tabStyle) {
      default:
        return "border-b-2 py-3 border-transparent data-[state=active]:border-primary";
    }
  };

  return (
    <DasboardLayout>
      <div
        className="flex items-center mb-4 hover:cursor-pointer w-max"
        onClick={() => navigate("/dashboard")}>
        <ChevronLeft size={16} />{" "}
        <p className="ml-2 hover:underline underline-offset-2">Back</p>
      </div>
      {isPending ? (
        <div className="h-[80vh] flex items-center justify-center">
          <Loader className="animate-spin" size={20} />
        </div>
      ) : (
        <>
          <div className="flex flex-row items-end justify-between mb-4">
            <h1 className="text-xl font-semibold">Campaign Details</h1>
            <div>
              <p
                className={` w-max font-semibold py-[0.25rem] px-[0.45rem] rounded-full ${
                  campaignData?.status === "Published"
                    ? "text-green-500 border-green-500 bg-green-100 "
                    : "text-yellow-500 border-yellow-500 bg-yellow-100"
                }  text-[0.675rem] border  `}>
                Status: {campaignData?.status}
              </p>
            </div>
          </div>
          <Tabs defaultValue="emails" className="w-full flex flex-col flex-1">
            <TabsList className="flex justify-start h-auto p-0 bg-transparent border-b border-b-gray-300 rounded-none">
              {tabData.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`px-4 py-2 font-medium transition-all rounded-none !shadow-none ${getTabStyles(
                    "default"
                  )}`}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabData.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="flex flex-col data-[state=active]:flex-1">
                {tab.content(data?.data)}
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </DasboardLayout>
  );
};

export default Campaign;
