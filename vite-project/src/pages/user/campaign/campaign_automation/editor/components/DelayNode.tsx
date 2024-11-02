import { NodeProps, Position } from "@xyflow/react";
import { DelayNodeProps } from "../types/EditorTypes";
import { Hourglass } from "lucide-react";
import { CustomHandle } from "../elements/CustomHandle";
import { Separator } from "@/components/ui/separator";
import NodeSelect from "../elements/NodeSelect";

export const DelayNode = (props: NodeProps<DelayNodeProps>) => {
  const { data } = props;
  return (
    <div
      className={`w-60 cursor-grab border-black border rounded ${
        data.connected === undefined
          ? "bg-slate-50"
          : data.connected
          ? "bg-green-100"
          : "bg-red-100"
      }`}>
      <CustomHandle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 border-2 border-white bg-gray-800"
      />
      <div className="flex flex-row items-center p-2">
        <Hourglass size={14} className="mr-2" />
        <h3 className="text-sm font-semibold">Delay Node</h3>
      </div>
      <Separator className="border-black border-b-[1px]" />
      <div className="h-full flex flex-col gap-2 p-3">
        <NodeSelect
          label="Delay Value"
          placeholder="Select Delay..."
          options={[
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 30, 36, 42, 48, 54, 60,
          ].map((i) => ({ key: i.toString(), value: i.toString() }))}
        />
        <NodeSelect
          label="Delay Format"
          placeholder="Select Format..."
          options={[
            {
              key: "mins",
              value: "Minutes",
            },
            {
              key: "hrs",
              value: "Hours",
            },
          ]}
        />
      </div>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 border-2 border-white bg-gray-800"
      />
    </div>
  );
};
