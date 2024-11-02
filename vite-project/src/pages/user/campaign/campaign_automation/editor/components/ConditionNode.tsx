import { NodeProps, Position } from "@xyflow/react";
import { CustomHandle } from "../elements/CustomHandle";
import { GitBranch } from "lucide-react";
import { ConditionNodeProps } from "../types/EditorTypes";

export const ConditionNode = (props: NodeProps<ConditionNodeProps>) => {
  const { data } = props;

  return (
    <div
      className={`w-40 cursor-grab border-black border rounded p-2 ${
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
      <div className="flex flex-row items-center p-0">
        <GitBranch size={14} className="mr-2" />
        <h3 className="text-sm font-semibold">Condition Node</h3>
      </div>
      <CustomHandle
        id="yes"
        type="source"
        position={Position.Left}
        className="!h-3 !w-3 border-2 border-white bg-green-800"
      />
      <CustomHandle
        id="no"
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 border-2 border-white bg-red-800"
      />
    </div>
  );
};
