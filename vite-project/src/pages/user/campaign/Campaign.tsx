import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import DasboardLayout from "@/components/layout/DasboardLayout";
import { ChevronLeft, Loader } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useGetQuery from "@/hooks/useGetQuery";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CampaignContacts from "./campaign_contacts/Campaign.Contacts";
import CampaignAutomationBuilder from "./campaign_automation/Campaign.AutomationBuilder";

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
      value: "contacts",
      label: "Contacts",
      content: (data: CampaignType) => (
        <CampaignContacts data={data?.contacts} campaignId={id || ""} />
      ),
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
        <ChevronLeft size={18} />{" "}
        <p className="ml-2 hover:underline underline-offset-2">Back</p>
      </div>
      {isPending ? (
        <div className="h-[80vh] flex items-center justify-center">
          <Loader className="animate-spin" size={20} />
        </div>
      ) : (
        <>
          <div className="flex flex-row items-end justify-between mb-8">
            <h1 className="text-2xl font-semibold">Campaign Details</h1>
            <div>
              <p
                className={` w-max font-semibold py-[0.25rem] px-[0.45rem] rounded-full ${
                  campaignData?.status === "published"
                    ? "text-green-500 border-green-500 bg-green-100 "
                    : "text-yellow-500 border-yellow-500 bg-yellow-100"
                }  text-[0.675rem] border  `}>
                Status: {campaignData?.status}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[auto_1fr] items-baseline gap-4 mb-8">
            <Label htmlFor="name" className="text-right">
              Campaign Name
            </Label>
            <Input
              id="name"
              placeholder="Enter template name..."
              className="max-w-md"
              value={campaignData?.name || ""}
              readOnly
              //   onChange={(e) => setTemplateName(e.target.value)}
            />
            <Label htmlFor="name" className="text-right">
              Campaign Email
            </Label>
            <Input
              id="name"
              placeholder="Enter subject..."
              className="max-w-md"
              value={campaignData?.emailAccount?.emailId || ""}
              readOnly
              //   onChange={(e) => setEmailSubject(e.target.value)}
            />
          </div>
          <Tabs defaultValue="contacts" className="w-full">
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
              <TabsContent key={tab.value} value={tab.value} className="mt-4">
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
