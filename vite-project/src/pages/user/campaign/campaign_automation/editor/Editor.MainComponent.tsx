import {
  Background,
  Connection,
  ConnectionLineType,
  ControlButton,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  Node,
  OnBeforeDelete,
  OnNodesChange,
  ReactFlow,
  ReactFlowInstance,
} from "@xyflow/react";
import { Dispatch, SetStateAction } from "react";
import { nodeTypes } from "./components/NodeVariants";
import { LayoutPanelTop } from "lucide-react";

type EditorMainComponentTypes = {
  nodes: Node[];
  edges: Edge[];
  setRefInstance: Dispatch<SetStateAction<ReactFlowInstance | null>>;
  onBeforeDelete: OnBeforeDelete<Node, Edge>;
  handleNodesChange: OnNodesChange<Node>;
  handleEdgesChange: (changes: EdgeChange<Edge>[]) => void;
  onConnect: (params: Connection) => void;
  onDragOver: (event: {
    preventDefault: () => void;
    dataTransfer: { dropEffect: string };
  }) => void;
  onDrop: (event: {
    preventDefault: () => void;
    dataTransfer: { getData: (arg0: string) => string };
    clientX: number;
    clientY: number;
  }) => void;
  onLayout: () => void;
};

const EditorMainComponent: React.FC<EditorMainComponentTypes> = ({
  nodes,
  edges,
  setRefInstance,
  onBeforeDelete,
  handleNodesChange,
  handleEdgesChange,
  onConnect,
  onDragOver,
  onDrop,
  onLayout,
}) => {
  return (
    <div className="h-full flex-1 bg-gray-100">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onInit={setRefInstance}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{ strokeWidth: 2, stroke: "black" }}
        onBeforeDelete={onBeforeDelete}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ maxZoom: 1 }}>
        {/* <Panel position="top-right">
          <div className="panel">Top right</div>
        </Panel> */}
        <Controls>
          <ControlButton onClick={() => onLayout()}>
            <LayoutPanelTop strokeWidth={2} />
          </ControlButton>
        </Controls>
        <MiniMap zoomable pannable />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default EditorMainComponent;
