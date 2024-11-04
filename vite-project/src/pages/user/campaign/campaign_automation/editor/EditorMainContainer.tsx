import { useCallback, useEffect, useRef, useState } from "react";
import {
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  Edge,
  Connection,
  ReactFlowInstance,
  NodeChange,
  EdgeChange,
  Node,
  OnBeforeDelete,
  OnNodesChange,
} from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "@/components/ui/separator";
import EditorMainComponent from "./Editor.MainComponent";
import EditorSideComponentsContainer from "./Editor.SideComponentsContainer";

import "@xyflow/react/dist/style.css";
import dagre from "dagre";
// import { v4 as uuidv4 } from "uuid";
import {
  CustomNodeType,
  DelayNodeProps,
  Email,
  EmailNodeProps,
} from "./types/EditorTypes";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import usePostQuery from "@/hooks/usePostQuery";
import { queryClient } from "@/App";

const initialNodes: CustomNodeType[] = [
  {
    id: "start",
    type: "start",
    position: { x: 0, y: 0 },
    data: { label: "Triggers when new user is added." },
  },
];
const initialEdges: Edge[] = [];

// auto layout

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Helper function to get node dimensions
const getNodeDimensions = (node: CustomNodeType) => {
  const defaultDimensions = { width: 250, height: 56 };

  const padding = 30;

  console.log(node.type);

  const typeDimensions: Record<string, { width: number; height: number }> = {
    start: { width: 160 + padding, height: 40 + padding },
    email: { width: 240 + padding, height: 115 + padding },
    delay: { width: 240 + padding, height: 174 + padding },
    condition: { width: 160 + padding, height: 40 + padding },
  };

  return typeDimensions[node.type] || defaultDimensions;
};

const getLayoutedElements = (
  nodes: CustomNodeType[],
  edges: Edge[],
  direction = "TB"
) => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    const { width, height } = getNodeDimensions(node);
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const { width, height } = getNodeDimensions(node);

    const newNode = {
      ...node,
      targetPosition: "top",
      sourcePosition: "bottom",
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
      anchorPoint: { x: 0.5, y: 0.5 },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

const getDelayNodeTime = (delayNode: DelayNodeProps) => {
  const { time, format } = delayNode.data;
  if (!time || !format) {
    return 0;
  }

  const timeNum = parseInt(time);
  let totMins = 0;
  if (format === "hours") {
    totMins = timeNum * 60; // Convert hours to minutes
  } else if (format === "minutes") {
    totMins = timeNum; // Already in minutes
  }

  return totMins;
};

const EditorMainContainer: React.FC<{
  campaignName: string | undefined;
  campaignId: string | undefined;
  automationFlowEditorData: string | null | undefined;
}> = ({ campaignName, campaignId, automationFlowEditorData }) => {
  //  save-editor
  const { mutate, isPending: isSaving } = usePostQuery(
    "/api/campaigns/save-editor"
  );
  const navigate = useNavigate();
  const { fitView } = useReactFlow();
  const [refInstance, setRefInstance] = useState<ReactFlowInstance | null>(
    null
  );
  const layoutApplied = useRef(false);
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const isEdgesDeleted = useRef(false);
  // const { zoom } = useViewport(); // Get current viewport
  // const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 }); // Store drag start position

  const isConnectedToStart = useCallback(
    (nodeId: string, visited = new Set(), pEdges: Edge[]): boolean => {
      if (nodeId === "start") return true;
      if (visited.has(nodeId)) return false;
      visited.add(nodeId);

      const incomingEdges = pEdges.filter((edge) => edge.target === nodeId);
      return incomingEdges.some((edge) =>
        isConnectedToStart(edge.source, visited, pEdges)
      );
    },
    []
  );
  const updateNodeColor = useCallback(
    (
      nodeId: string,
      pNodes: CustomNodeType[],
      pEdges: Edge[]
    ): CustomNodeType[] => {
      console.log("update node color");

      return pNodes.map((node) => {
        if (node.id === nodeId) {
          const isConnected = isConnectedToStart(
            nodeId,
            new Set<string>(),
            pEdges
          );

          return {
            ...node,
            data: {
              ...node.data,
              connected: isConnected ? true : false,
            },
          };
        }
        return node;
      });
    },
    [isConnectedToStart]
  );

  const updateAllNodes = useCallback(
    (pNodes = nodes, pEdges = edges) => {
      return pNodes.map((node) => {
        // Update a single node color based on connection to start
        const updatedNode = updateNodeColor(node.id, nodes, pEdges);
        // Since `updateNodeColor` is returning an array, extract the updated node
        return updatedNode.find((n) => n.id === node.id);
      });
    },
    [edges, nodes, updateNodeColor]
  );

  const updateEdgeColor = useCallback(
    (source: string, target: string, pEdges: Edge[]) => {
      return pEdges.map((edge) => {
        if (edge.source === source && edge.target === target) {
          const isSourceConnected = isConnectedToStart(
            edge.source,
            new Set(),
            pEdges
          );
          const isTargetConnected = isConnectedToStart(
            edge.target,
            new Set(),
            pEdges
          );
          return {
            ...edge,
            style: {
              ...edge.style,
              stroke: isSourceConnected || isTargetConnected ? "green" : "red",
            },
          };
        }
        return edge;
      });
    },
    [isConnectedToStart]
  );

  const updateAllEdges = useCallback(
    (pEdges = edges) => {
      return pEdges.map((edge) => {
        const updatedEdges = updateEdgeColor(edge.source, edge.target, pEdges);
        return updatedEdges.find((e) => e.id === edge.id);
      });
    },
    [edges, updateEdgeColor]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      if (!sourceNode || !targetNode) {
        console.error("Source or target node not found.");
        return;
      }

      if (
        (sourceNode.type === "start" &&
          ["delay", "email"].includes(targetNode.type)) ||
        (sourceNode.type === "delay" &&
          ["email", "condition", "delay"].includes(targetNode.type)) ||
        (sourceNode.type === "email" && ["delay"].includes(targetNode.type)) ||
        (sourceNode.type === "condition" &&
          ["delay", "email"].includes(targetNode.type))
      ) {
        let tempEdges = addEdge(
          {
            ...params,
            type: "smoothstep",
            style: { strokeWidth: 2, stroke: "black" },
          },
          edges
        );

        // Filter out undefined values to ensure tempEdges is Edge[]
        tempEdges = tempEdges.filter(
          (edge): edge is Edge => edge !== undefined
        );

        const tempNodes = updateAllNodes(nodes, tempEdges).filter(
          (node): node is CustomNodeType => node !== undefined
        );
        tempEdges = updateAllEdges(tempEdges).filter(
          (edge): edge is Edge => edge !== undefined
        );

        setEdges(tempEdges);
        setNodes(tempNodes);
      } else {
        if (
          sourceNode.type === "start" &&
          !["delay", "email"].includes(targetNode.type)
        ) {
          toast({
            title: "Oops!!! You cannot attach to this node",
            variant: "destructive",
            description:
              'A "start" node can only connect to a "delay" or "email" node.',
          });
        }
        if (
          sourceNode.type === "delay" &&
          !["email", "condition"].includes(targetNode.type)
        ) {
          toast({
            title: "Oops!!! You cannot attach to this node",
            variant: "destructive",
            description:
              'A "delay" node can only connect to an "email" or "condition" node.',
          });
        }
        if (
          sourceNode.type === "email" &&
          !["delay"].includes(targetNode.type)
        ) {
          toast({
            title: "Oops!!! You cannot attach to this node",
            variant: "destructive",
            description: 'An "email" node can only connect to a "delay" node.',
          });
        }
        if (sourceNode.type === "condition" && targetNode.type !== "email") {
          toast({
            title: "Oops!!! You cannot attach to this node",
            variant: "destructive",
            description:
              'A "condition" node can only connect to an "email" node.',
          });
        }
      }
    },
    [nodes, edges, updateAllNodes, updateAllEdges, setEdges, setNodes]
  );

  const onBeforeDelete: OnBeforeDelete<Node, Edge> = useCallback(
    async ({ nodes: nodesToBeDeleted, edges: edgesToBeDeleted }) => {
      // apply changes to nodes
      const newNodesToBeDeleted = nodesToBeDeleted.filter(
        ({ id }) => !(id === "start")
      );

      return {
        nodes: newNodesToBeDeleted,
        edges: edgesToBeDeleted,
      };
    },
    []
  );

  const onDragOver = useCallback(
    (event: {
      preventDefault: () => void;
      dataTransfer: { dropEffect: string };
    }) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    []
  );

  const onDrop = useCallback(
    (event: {
      preventDefault: () => void;
      dataTransfer: { getData: (arg0: string) => string };
      clientX: number;
      clientY: number;
    }) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");

      if (!refInstance) return;

      const position = refInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes, refInstance]
  );

  const onDragStart = useCallback(
    (
      event: {
        dataTransfer: { setData: (arg0: string, arg1: string) => void };
      },
      type: string
    ) => {
      event.dataTransfer.setData("application/reactflow", type);
    },
    []
  );

  const onLayout = useCallback(() => {
    // Check connectivity and update node colors
    const updatedNodes = nodes.map((node) => {
      if (node.id === "start")
        return {
          ...node,
          data: {
            ...node.data,
            connected: true, // Light green for connected, light red for unconnected
          },
        }; // Skip the start node
      const isConnected = isConnectedToStart(node.id, new Set(), edges);
      return {
        ...node,
        data: {
          ...node.data,
          connected: isConnected ? true : false, // Light green for connected, light red for unconnected
        },
      };
    });

    // Update edge colors
    const updatedEdges = edges.map((edge) => {
      const isSourceConnected = isConnectedToStart(
        edge.source,
        new Set(),
        edges
      );
      const isTargetConnected = isConnectedToStart(
        edge.target,
        new Set(),
        edges
      );
      return {
        ...edge,
        style: {
          ...edge.style,
          stroke: isSourceConnected || isTargetConnected ? "green" : "red",
        },
      };
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      updatedNodes,
      updatedEdges,
      "TB"
    );

    setNodes([...(layoutedNodes as CustomNodeType[])]);
    setEdges([...layoutedEdges]);

    // render all the layouted nodes in center
    layoutApplied.current = true;
  }, [nodes, edges, setNodes, setEdges, isConnectedToStart]);

  const onSave = () => {
    // saving the instance
    if (refInstance) {
      const flow = refInstance.toObject();
      mutate(
        {
          campaignId,
          automationFlowEditorData: JSON.stringify(flow),
        },
        {
          onSuccess: () => {
            toast({
              title: "Flow saved Successfully.",
              description:
                "You would be able to create automation for your campaign.",
            });
            queryClient.invalidateQueries({
              queryKey: ["campaign-details", campaignId],
            });
          },
          onError: () => {
            toast({
              title: "Oops!! There was some issue while saving the flow",
              description: "Please try again later..",
            });
          },
        }
      );
    }
  };

  const onPublish = () => {
    // check for nodes that are not connected to start trigger

    let isConnectedToStartCheck = true;
    let containsAtleastOneEmail = false;

    nodes.forEach((node) => {
      const isConnected = isConnectedToStart(node.id, new Set(), edges);
      if (!isConnected) {
        isConnectedToStartCheck = false;
      }
      if (node.type === "email") {
        containsAtleastOneEmail = true;
      }
    });

    if (!isConnectedToStartCheck) {
      toast({
        title: "Oops!!! Cannot publish",
        variant: "destructive",
        description: "Cannot publish: Some nodes are not connected to start",
      });
      return;
    }

    if (!containsAtleastOneEmail) {
      toast({
        title: "Oops!!! Cannot publish",
        variant: "destructive",
        description: "Cannot publish: Must have atleast one email on trigger",
      });

      return;
    }

    // check if nodes contain empty input values for email & delay
    let emptyInputFound = false;
    nodes.map((node) => {
      if (node.type == "email" || node.type == "delay") {
        if (node.type == "email") {
          console.log(node.data);
          if (!node.data.templateId || node.data.templateId == "") {
            emptyInputFound = true;
          }
        } else {
          if (
            !node.data.format ||
            node.data.format == "" ||
            !node.data.time ||
            node.data.time == ""
          ) {
            emptyInputFound = true;
          }
        }
      }
    });

    if (emptyInputFound) {
      toast({
        title: "Oops!!! Cannot publish",
        variant: "destructive",
        description: "Empty Input Found: Input cannot be empty",
      });

      return;
    }

    // Saving the current state of the editor
    // onSave();

    // // Generate the JSON output
    // // Current issue is that is push the node inside the array even if it is nested.

    const emails: Email[] = [];
    // let emailId = 1;

    const getNextNode = (nodeId: string) => {
      const outgoingEdge = edges.find((e) => e.source === nodeId);
      return outgoingEdge
        ? nodes.find((n) => n.id === outgoingEdge.target)
        : null;
    };

    const processEmailNode = (
      emailNode: EmailNodeProps,
      parentEmailId: string | null = null,
      accumulatedDelay = 0,
      branch: string | null = null
    ): string | null => {
      try {
        const uniqueId = uuidv4();
        if (!emailNode.data.templateId) {
          throw new Error("templateId not found");
        }

        const email: Email = {
          id: uniqueId,
          templateId: emailNode.data.templateId,
          delay_hours: accumulatedDelay,
          parent_email_id: parentEmailId,
        };

        if (branch) {
          email.branch = branch;
        }

        emails.push(email);

        accumulatedDelay = 0;

        const nextNode = getNextNode(emailNode.id);
        if (nextNode) {
          if (nextNode.type === "delay") {
            const delayMins = getDelayNodeTime(nextNode as DelayNodeProps);
            const newNextNode = getNextNode(nextNode.id);
            if (!newNextNode) throw new Error("Next Node cannot be empty");

            const newNextNodeId = processNode(
              newNextNode,
              email.id,
              accumulatedDelay + delayMins,
              branch
            );
            if (!newNextNodeId) throw new Error("Next Node ID cannot be empty");

            email.next_email_id = newNextNodeId;
          } else if (nextNode.type === "condition") {
            const processedConditionNode = processConditionNode(
              nextNode,
              email.id,
              accumulatedDelay
            );
            if (!processedConditionNode)
              throw new Error("Condition Node result cannot be empty");

            email.condition = processedConditionNode;
            delete email.next_email_id;
          } else {
            const nextEmailId = processNode(
              nextNode,
              email.id,
              accumulatedDelay,
              branch
            );
            if (!nextEmailId) throw new Error("Next Node ID cannot be empty");
            email.next_email_id = nextEmailId;
          }
        }

        return email.id;
      } catch (error) {
        console.error("Error processing email node:", error);
        return null;
      }
    };

    const processConditionNode = (
      conditionNode: CustomNodeType,
      parentEmailId: string,
      accumulatedDelay: number
    ): {
      type: string;
      true_branch: {
        email_id: string | null;
      };
      false_branch: {
        email_id: string | null;
      };
    } => {
      const trueEdge = edges.find(
        (e) => e.source === conditionNode.id && e.sourceHandle === "yes"
      );
      const falseEdge = edges.find(
        (e) => e.source === conditionNode.id && e.sourceHandle === "no"
      );

      const processBranch = (
        edge: Edge | undefined,
        branchType: string | null
      ): string | null => {
        if (!edge) return null;
        const nextNode = nodes.find((n) => n.id === edge.target);
        if (nextNode) {
          return processNode(
            nextNode,
            parentEmailId,
            accumulatedDelay,
            branchType
          );
        }
        return null;
      };

      return {
        type: (conditionNode.data.conditionType as string) || "opened",
        true_branch: { email_id: processBranch(trueEdge, "true") },
        false_branch: { email_id: processBranch(falseEdge, "false") },
      };
    };

    const processNode = (
      node: CustomNodeType,
      parentEmailId: string | null = null,
      accumulatedDelay = 0,
      branch: string | null = null
    ): string | null => {
      if (!node) return null;

      try {
        switch (node.type) {
          case "email":
            return processEmailNode(
              node as EmailNodeProps,
              parentEmailId,
              accumulatedDelay,
              branch
            );
          case "delay": {
            const delayMins = getDelayNodeTime(node as DelayNodeProps);
            const nextNode = getNextNode(node.id);
            if (!nextNode) throw new Error("Next Node cannot be empty");
            return processNode(
              nextNode,
              parentEmailId,
              accumulatedDelay + delayMins,
              branch
            );
          }
          case "condition": {
            const lastEmail = emails[emails.length - 1];
            if (!lastEmail) {
              throw new Error("No previous email found for condition node.");
            }
            lastEmail.condition = processConditionNode(
              node,
              lastEmail.id,
              accumulatedDelay
            );
            // Remove next_email_id for emails with conditions
            delete lastEmail.next_email_id;
            return lastEmail.id;
          }
          default:
            throw new Error(`Unexpected node type: ${node.type}`); // Throw error instead of warning
        }
      } catch (error) {
        console.error("Error processing node:", error);
        return null; // Or handle the error differently
      }
    };

    // Start processing from the 'start' node
    const startNode = nodes.find((n) => n.type === "start");
    if (!startNode) return console.error("Start Node is not present");
    const firstNode = getNextNode(startNode.id);
    if (firstNode) {
      processNode(firstNode);
    } else {
      console.warn("No node connected to the start node");
    }

    const output = { emails };
    console.log(JSON.stringify(output, null, 2));
  };

  const handleNodesChange: OnNodesChange<Node> = useCallback(
    (changes) => {
      // Cast changes to your custom node type if needed
      const customChanges = changes as NodeChange<CustomNodeType>[];

      // Use applyNodeChanges to update nodes
      setNodes((prevNodes) => {
        // Map the nodes, preserving custom node type
        return applyNodeChanges(
          customChanges.map((change) => {
            // If the change involves adding a node, ensure it matches CustomNodeType
            if (change.type === "add") {
              return {
                ...change,
                item: change.item as CustomNodeType,
              };
            }
            return change;
          }),
          prevNodes
        );
      });
    },
    [setNodes]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      let isLocalDeleted = false;
      changes.forEach(({ type }) => {
        if (type === "remove") isLocalDeleted = true;
      });
      setEdges((eds) => {
        const edgesAfterChangesApplied = applyEdgeChanges(changes, eds);
        if (isLocalDeleted) isEdgesDeleted.current = true;
        return edgesAfterChangesApplied;
      });
    },
    [setEdges]
  );

  useEffect(() => {
    // on checks if
    if (isEdgesDeleted.current) {
      console.log("After deletion fresh state");
      const tempNodes = updateAllNodes(nodes, edges).filter(
        (node): node is CustomNodeType => node !== undefined
      );
      const tempEdges = updateAllEdges(edges).filter(
        (edge): edge is Edge => edge !== undefined
      );
      setEdges(tempEdges);
      setNodes(tempNodes);
      isEdgesDeleted.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  // makes sure on save fitview function runs after all the nodes are placed.
  useEffect(() => {
    if (layoutApplied.current) {
      fitView();
      layoutApplied.current = false;
    }
  }, [nodes, fitView]);

  useEffect(() => {
    if (automationFlowEditorData) {
      const flow = JSON.parse(automationFlowEditorData);
      if (flow) {
        setNodes(flow.nodes || [initialNodes]);
        setEdges(flow.edges || [initialEdges]);
      }
    }
  }, [automationFlowEditorData, setEdges, setNodes]);

  return (
    <>
      <div className="flex items-center justify-between px-6 py-3">
        <div
          className="flex items-center hover:cursor-pointer w-max"
          onClick={() => navigate(`/dashboard/${campaignId}`)}>
          <ChevronLeft size={16} />
          <p className="ml-4 ">{campaignName}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button size={"xs"} variant={"outline"} onClick={onSave}>
            {isSaving ? <Loader className="animate-spin" size={20} /> : "Save"}
          </Button>
          <Button size={"xs"} onClick={onPublish}>
            Publish
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex flex-row w-screen flex-1">
        <EditorMainComponent
          nodes={nodes}
          edges={edges}
          setRefInstance={setRefInstance}
          onBeforeDelete={onBeforeDelete}
          handleNodesChange={handleNodesChange}
          handleEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onLayout={onLayout}
        />
        <Separator orientation="vertical" />
        <EditorSideComponentsContainer
          onDragStart={onDragStart}
          onLayout={onLayout}
        />
      </div>
    </>
  );
};

export default EditorMainContainer;
