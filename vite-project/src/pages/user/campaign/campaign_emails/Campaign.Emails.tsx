import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Email } from "@/types/CampaignTypes";
import { Clock, Mail, Send } from "lucide-react";
import EmailTreeView from "./EmailTreeView";

const tabs = [
  {
    value: "flow",
    label: "Flow",
    icon: <Mail size={14} />,
  },
  {
    value: "queue",
    label: "Queue",
    icon: <Clock size={14} />,
  },
  {
    value: "send",
    label: "Send",
    icon: <Send size={14} />,
  },
];

const getDateString = (date: string) => {
  const tDate = new Date(date);
  return `${tDate.getDate()}/${tDate.getMonth() + 1}/${tDate.getFullYear()} @ ${
    tDate.getHours() > 10 ? tDate.getHours() % 12 : "0" + tDate.getHours()
  }:${
    tDate.getMinutes() > 10 ? tDate.getMinutes() : "0" + tDate.getMinutes()
  } ${tDate.getHours() > 11 ? "pm" : "am"}`;
};

const CampaignEmails: React.FC<{ id: string | undefined; emails: Email[] }> = ({
  emails,
}) => {
  const getTabStyles = (tab: string) => {
    switch (tab) {
      case "flow":
        return " data-[state=active]:bg-blue-50  data-[state=active]:text-blue-400 data-[state=active]:border-blue-400";
      case "queue":
        return "data-[state=active]:bg-amber-50  data-[state=active]:text-amber-400 data-[state=active]:border-amber-400";
      case "send":
        return "data-[state=active]:bg-green-50  data-[state=active]:text-green-400 data-[state=active]:border-green-400";
      default:
        return "border data-[state=active]:border-primary bg-green-50";
    }
  };

  if (emails.length === 0) {
    return (
      <div className="flex h-[20rem] flex-col items-center justify-center">
        <h1 className="text-xl font-semibold">Oops !!! No Emails Found.</h1>
        <p className="text-sm text-slate-600 my-2 mb-4">
          Either the campaign is not published or it is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Tabs defaultValue="flow" className="w-full flex flex-col flex-1 gap-4">
        <TabsList className="flex justify-start h-auto p-0 bg-transparent ">
          {tabs.map(({ value, label, icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={`flex items-center gap-2 px-3 py-1 rounded-full mr-3 text-sm font-medium transition-all !shadow-none border ${getTabStyles(
                value
              )}`}>
              {icon}
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="flow">
          <EmailTreeView emails={emails} />
        </TabsContent>

        {/* Queue Tab */}
        <TabsContent value="queue">
          <div className="space-y-4">
            {!emails.some((email) => email.emailQueue.length > 0) ? (
              <p className="text-center text-gray-500 mt-24">
                No emails currently in email queue
              </p>
            ) : (
              <>
                {emails.map((email) => {
                  return (
                    <div className="flex flex-col space-y-2 p-2 border rounded-md">
                      <div className="px-2 py-3">
                        <h3 className="font-medium">
                          Email: {email.template.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Subject: {email.template.subject}
                        </p>
                      </div>
                      {email.emailQueue.map((queueItem) => (
                        <div
                          key={queueItem.id}
                          className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">
                                {queueItem.contact.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {queueItem.contact.email}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">Scheduled</p>
                              <p className="text-sm text-gray-500">
                                {getDateString(queueItem.scheduledTime)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {email.emailQueue.length == 0 && (
                        <p className="text-center py-6 text-sm text-gray-500">
                          No emails in the queue for this template
                        </p>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </TabsContent>

        {/* Send Queue Tab */}
        <TabsContent value="send">
          <div className="space-y-4">
            {!emails.some((email) => email.emailSendQueue.length > 0) ? (
              <p className="text-center text-gray-500 mt-24">
                No emails currently in send queue
              </p>
            ) : (
              <>
                {emails.map((email) => {
                  return (
                    <div className="flex flex-col space-y-2 p-2 border rounded-md">
                      <div className="px-2 py-3">
                        <h3 className="font-medium">
                          Email: {email.template.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Subject: {email.template.subject}
                        </p>
                      </div>
                      {email.emailSendQueue.map((sendItem) => (
                        <div
                          key={sendItem.id}
                          className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">
                                {sendItem.contact.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {sendItem.contact.email}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">Send Time</p>
                              <p className="text-sm text-gray-500">
                                {getDateString(sendItem.sendTime)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {email.emailSendQueue.length == 0 && (
                        <p className="text-center py-6 text-sm text-gray-500">
                          No emails in the queue for this template
                        </p>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignEmails;
