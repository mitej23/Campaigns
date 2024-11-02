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
  name: string;
  label: string;
  placeholder: string;
  options: {
    key: string;
    value: string;
  }[];
  selectedValue: string;
  handleSelectChange: (key: string, value: string) => void;
};

const NodeSelect: React.FC<NodeSelectProps> = ({
  name,
  label,
  placeholder,
  options,
  selectedValue,
  handleSelectChange,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium">
        {label}{" "}
        {!selectedValue && (
          <span className="text-red-600">(Cannot be empty!!)</span>
        )}
      </Label>
      <Select
        onValueChange={(value) => handleSelectChange(name, value)}
        defaultValue={selectedValue}>
        <SelectTrigger
          className={`py-1.5 px-2 rounded-sm text-xs h-full focus:ring-1 ${
            selectedValue
              ? "border-gray-800 bg-gray-50 focus:ring-gray-600"
              : "border-red-800 bg-red-50 focus:ring-red-600"
          }  focus:ring-offset-1`}>
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
