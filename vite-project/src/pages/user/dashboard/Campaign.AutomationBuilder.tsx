import { useParams } from "react-router-dom";

const CampaignAutomationBuilder = () => {
  const { id } = useParams();
  console.log(id);
  return <div>CampaignAutomationBuilder</div>;
};

export default CampaignAutomationBuilder;
