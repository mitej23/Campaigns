import { SquareFunction } from "lucide-react";
import { CustomHandle } from "../elements/CustomHandle";
import { Position } from "@xyflow/react";

export const StartNode = () => {
  return (
    <div className="w-40 cursor-grab p-2 border-black border rounded bg-green-100">
      <div className="flex flex-row items-center p-0">
        <SquareFunction size={14} className="mr-2" />
        <h3 className="text-sm font-semibold">Trigger Node</h3>
      </div>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 border-2 border-white bg-gray-800"
      />
    </div>
  );
};
