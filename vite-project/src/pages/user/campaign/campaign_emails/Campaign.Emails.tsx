import { Email } from "@/types/CampaignTypes";

const CampaignEmails: React.FC<{ id: string | undefined; emails: Email }> = ({
  id,
  emails,
}) => {
  console.log(id, emails);
  return <div className="mt-4">CampaignEmails</div>;
};

export default CampaignEmails;
