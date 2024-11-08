import { Button } from "@/components/ui/button";
import {
  Background,
  ConnectionLineType,
  Controls,
  Edge,
  ReactFlow,
  ReactFlowInstance,
  Panel,
} from "@xyflow/react";
import { useNavigate } from "react-router-dom";
import { nodeTypes } from "./editor/components/NodeVariants";
import { useEffect, useState } from "react";
import { CustomNodeType } from "./editor/types/EditorTypes";
import { Loader, PenLine } from "lucide-react";

const DataEmptyComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 border rounded-md shadow-md flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">
        Oops !!! No Automation Flow Found.
      </h1>
      <p className="text-sm text-slate-600 my-2 mb-4">
        Press the below button to create your first account
      </p>
      <Button size={"sm"} onClick={() => navigate("editor")}>
        Create Automation Flow
      </Button>
    </div>
  );
};

const initialNodes: CustomNodeType[] = [
  {
    id: "start",
    type: "start",
    position: { x: 0, y: 0 },
    data: { label: "Triggers when new user is added." },
  },
];
const initialEdges: Edge[] = [];

const CampaignAutomationBuilder = ({
  automationFlowEditorData,
}: {
  automationFlowEditorData: string | null;
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [, setRefInstance] = useState<ReactFlowInstance | null>(null);

  useEffect(() => {
    if (loading && automationFlowEditorData) {
      const flow = JSON.parse(automationFlowEditorData);

      if (flow) {
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setLoading(false);
      }
    }
  }, [automationFlowEditorData, loading]);

  if (!automationFlowEditorData) return <DataEmptyComponent />;

  return (
    <div className="h-[30rem] border rounded-md mt-4">
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Loader className="animate-spin" size={20} />
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onInit={setRefInstance}
          panOnDrag={true}
          elementsSelectable={false}
          edgesFocusable={false}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          draggable={false}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionLineStyle={{ strokeWidth: 2, stroke: "black" }}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ maxZoom: 1 }}>
          <Panel position="top-right">
            <div
              className="flex items-center bg-black text-white font-semibold h-max text-xs py-1.5 px-2.5 rounded-lg hover:cursor-pointer"
              onClick={() => navigate("editor")}>
              Edit
              <PenLine size={12} className="ml-2 mt-[2px]" />
            </div>
          </Panel>
          <Controls />
          <Background gap={12} size={1} />
        </ReactFlow>
      )}
    </div>
  );
};

export default CampaignAutomationBuilder;
