import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CampaignSettings: React.FC<{ name: string; email: string }> = ({
  name,
  email,
}) => {
  return (
    <div className="grid grid-cols-[auto_1fr] items-baseline gap-4 mb-8 pt-4">
      <Label htmlFor="name" className="text-left min-w-40">
        Campaign Name:
      </Label>
      <Input
        id="name"
        placeholder="Enter template name..."
        className="max-w-md"
        value={name || ""}
        readOnly
        //   onChange={(e) => setTemplateName(e.target.value)}
      />
      <Label htmlFor="name" className="text-left min-w-40">
        Campaign Email:
      </Label>
      <Input
        id="name"
        placeholder="Enter subject..."
        className="max-w-md"
        value={email || ""}
        readOnly
        //   onChange={(e) => setEmailSubject(e.target.value)}
      />
    </div>
  );
};

export default CampaignSettings;
