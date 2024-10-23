import DasboardLayout from "@/components/layout/DasboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetQuery from "@/hooks/useGetQuery";
import { CirclePlus, Loader, Mail, User } from "lucide-react";

const DataEmptyComponent = () => {
  return (
    <div className="flex h-[35rem] flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">
        Oops !!! No Email Templates Found.
      </h1>
      <p className=" text-slate-600 my-2 mb-4">
        Press the "Add Email Template" button to create your first account
      </p>
    </div>
  );
};

const Dashboard = () => {
  const { data, isPending } = useGetQuery("/api/campaigns", "", "campaigns");

  return (
    <DasboardLayout>
      <div className="flex flex-row items-end justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Campaigns</h1>
        <Button size={"sm"}>Create Campaign</Button>
      </div>
      {isPending ? (
        <div className="flex h-[25rem] items-center justify-center">
          <Loader className="animate-spin" size={20} />
        </div>
      ) : (
        <>
          {data?.data.length > 0 ? (
            <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-6 lg:gap-4 md:grid-cols-2  ">
              <Card className="flex flex-col items-center justify-center hover:shadow-md hover:cursor-pointer border-dashed">
                <CirclePlus
                  size={35}
                  className="text-gray-600 mb-3"
                  strokeWidth={1}
                />
                <p className="text-gray-600">Click to add campaign</p>
              </Card>
              {data.data.map(({ campaigns, email_accounts }) => (
                <Card
                  key={campaigns.id}
                  className="hover:shadow-md hover:cursor-pointer">
                  <CardHeader className="flex flex-row items-baseline justify-between p-5">
                    <CardTitle className="text-lg">{campaigns.name}</CardTitle>
                    <p
                      className={`w-max py-[0.125rem] px-[0.35rem] rounded-full ${
                        campaigns.status === " published"
                          ? "text-green-500 border-green-500 bg-green-100 "
                          : "text-yellow-500 border-yellow-500 bg-yellow-100"
                      }  text-[0.675rem] border  `}>
                      {campaigns.status}
                    </p>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="flex items-center mb-1">
                      <Mail size={14} className="mr-2" />
                      <p className="">{email_accounts.emailId}</p>
                    </div>
                    <div className="flex items-center mb-1">
                      <User size={14} className="mr-2" />
                      <p className="">24 users</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
