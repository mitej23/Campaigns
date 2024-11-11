import Sidebar from "@/components/layout/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useGetQuery from "@/hooks/useGetQuery";
import { getDateString } from "@/lib/utils";
import { Loader, Send } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import parse from "html-react-parser";

type EmailSent = {
  id: string;
  toEmail: string;
  fromEmail: string;
  subject: string;
  processedContent: string;
  sentAt: string;
  contact: {
    name: string;
  };
  campaign: {
    name: string;
  };
};

const Emails = () => {
  const { data, isPending } = useGetQuery(`/api/emails`, "", `emails`);
  const [emailSelected, setEmailSelected] = useState<EmailSent | null>(null);

  return (
    <div>
      <Sidebar />
      <div className="flex flex-row min-h-screen ml-[220px]">
        {/* Nested Sidebar */}
        <div className="w-[22rem] h-screen flex flex-col">
          <div className="flex flex-row justify-between items-center p-4">
            <div className="flex flex-row items-center gap-3">
              <h1 className="font-medium text-lg">Emails Sent</h1>{" "}
              {!isPending && (
                <p className="border border-gray-500 bg-gray-50 px-2 text-xs font-medium rounded-full text-gray-500">
                  {data?.data.length}
                </p>
              )}
            </div>
            <Send size={20} className="h-4 w-4" />
          </div>
          {isPending ? (
            <div className="flex-1 w-full flex items-center justify-center">
              <Loader className="animate-spin" size={20} />
            </div>
          ) : (
            <ScrollArea className="px-4">
              {data?.data.map((email: EmailSent) => {
                return (
                  <div
                    key={email.id}
                    className={`p-2.5 border rounded-md mb-3 hover:cursor-pointer ${
                      email.id === emailSelected?.id
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                    } hover:shadow`}
                    onClick={() => setEmailSelected(email)}>
                    <div className="mb-1 flex flex-row items-center justify-between">
                      <p className="font-medium text-sm">
                        {email.contact.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {moment(new Date(email.sentAt), "YYYYMMDD").fromNow()}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mb-0.5">
                      to: {email.toEmail}
                    </p>
                    <p className="text-xs text-gray-500 mb-2 ">
                      from: {email.fromEmail}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {email.subject}
                    </p>
                    <p className="w-max border border-gray-500 bg-gray-50 px-2 font-medium text-xs rounded-full text-gray-500">
                      {email.campaign.name}
                    </p>
                  </div>
                );
              })}
            </ScrollArea>
          )}
        </div>
        <Separator orientation="vertical" className="h-screen" />
        <div className="flex-1 h-screen ">
          {emailSelected ? (
            <div className="m-6">
              <h1 className="text-xl font-semibold">{emailSelected.subject}</h1>
              <div className="my-4 flex flex-row gap-4">
                <p className="p-2 px-4 text-xl bg-slate-100 w-max rounded-full text-slate-700">
                  {emailSelected?.contact?.name.charAt(0)}
                </p>
                <div className="flex flex-col">
                  <p className="font-semibold ">
                    {emailSelected?.contact?.name}{" "}
                    {/* <span className="font-normal">
                      ({emailSelected?.toEmail})
                    </span> */}
                  </p>
                  <p className="text-xs text-gray-500 ">
                    from: {emailSelected?.fromEmail}
                  </p>
                </div>
                <div className="ml-auto">
                  <p className="text-gray-500 text-sm">
                    {getDateString(emailSelected?.sentAt)}
                  </p>
                </div>
              </div>
              <div className="flex-1 h-full mt-6 ml-16">
                {parse(emailSelected?.processedContent)}
              </div>
            </div>
          ) : (
            <div className="flex-1 h-full w-full flex items-center justify-center">
              <p className="text-gray-500">No email selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Emails;
