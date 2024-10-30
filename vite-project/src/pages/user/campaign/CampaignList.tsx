import DasboardLayout from "@/components/layout/DasboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetQuery from "@/hooks/useGetQuery";
import { useModal } from "@/hooks/useModal";
import { CirclePlus, Loader, Mail, User } from "lucide-react";
import CreateCampaign from "./CreateCampaign.dialog";
import { useNavigate } from "react-router-dom";

type Contact = {
  // Add properties related to contacts if available
};

type EmailAccount = {
  emailId: string;
};

type Campaign = {
  id: string;
  name: string;
  status: string;
  contacts: Contact[]; // Array of Contact objects
  createdAt: string; // ISO date string
  emailAccount: EmailAccount;
};

const DataEmptyComponent = () => {
  return (
    <div className="flex h-[35rem] flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">Oops !!! Campaigns Found.</h1>
      <p className=" text-slate-600 my-2 mb-4">
        Press the "Add Campaign" button to create your first campaign
      </p>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isPending } = useGetQuery("/api/campaigns", "", "campaigns");
  const { setOpen } = useModal();

  const handleCreateCampaignModalOpen = () => {
    setOpen(<CreateCampaign />);
  };

  return (
    <DasboardLayout>
      <div className="flex flex-row items-end justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Campaigns</h1>
        <Button size={"sm"} onClick={handleCreateCampaignModalOpen}>
          Create Campaign
        </Button>
      </div>
      {isPending ? (
        <div className="flex h-[25rem] items-center justify-center">
          <Loader className="animate-spin" size={20} />
        </div>
      ) : (
        <>
          {data?.data.length > 0 ? (
            <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6 lg:gap-4 md:grid-cols-2  ">
              <Card
                className="flex flex-col items-center justify-center shadow hover:shadow-lg hover:cursor-pointer border-dashed p-6"
                onClick={handleCreateCampaignModalOpen}>
                <CirclePlus
                  size={35}
                  className="text-gray-400 mb-3"
                  strokeWidth={1}
                />
                <p className="text-gray-400">Click to add campaign</p>
              </Card>
              {data.data.map((temp: Campaign) => {
                const { id, name, status, emailAccount, contacts } = temp;
                return (
                  <Card
                    key={id}
                    className="shadow hover:shadow-lg hover:cursor-pointer"
                    onClick={() => navigate(`/dashboard/${id}`)}>
                    <CardHeader className="flex flex-row items-baseline justify-between p-5">
                      <CardTitle className="text-lg">{name}</CardTitle>
                      <p
                        className={`w-max py-[0.125rem] px-[0.35rem] rounded-full ${
                          status === " published"
                            ? "text-green-500 border-green-500 bg-green-100 "
                            : "text-yellow-500 border-yellow-500 bg-yellow-100"
                        }  text-[0.675rem] border  `}>
                        {status}
                      </p>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <div className="flex items-center mb-1 text-gray-600">
                        <Mail size={15} className="mr-3 mt-[2px]" />
                        <p className="text-sm">{emailAccount.emailId}</p>
                      </div>
                      <div className="flex items-center mb-1 text-gray-600">
                        <User size={15} className="mr-3 mt-[2px]" />
                        <p className="text-sm">{contacts.length} users</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <DataEmptyComponent />
          )}
        </>
      )}
    </DasboardLayout>
  );
};

export default Dashboard;
