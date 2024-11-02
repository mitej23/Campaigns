import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NodeSelectProps = {
  label: string;
  placeholder: string;
  options: {
    key: string;
    value: string;
  }[];
};

const NodeSelect: React.FC<NodeSelectProps> = ({
  label,
  placeholder,
  options,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <Select>
        <SelectTrigger className="py-1.5 px-2 rounded-sm text-xs h-full focus:ring-1 border-gray-800 bg-gray-50 focus:ring-gray-600 focus:ring-offset-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(({ key, value }) => (
              <SelectItem key={key} value={key}>
                {value}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NodeSelect;
