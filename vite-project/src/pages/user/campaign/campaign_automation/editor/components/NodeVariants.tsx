import {
  Handle,
  HandleProps,
  NodeProps,
  Position,
  useHandleConnections,
} from "@xyflow/react";
import "./NodeVariants.css";
import {
  DelayNodeProps,
  EmailNodeProps,
  StartNodeProps,
} from "../types/EditorTypes";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitBranch, Hourglass, Mail, SquareFunction } from "lucide-react";

const CustomHandle = (props: HandleProps) => {
  const connections = useHandleConnections({
    type: props.type,
  });

  return <Handle {...props} isConnectable={connections.length < 1} />;
};

const StartNode = (props: NodeProps<StartNodeProps>) => {
  const { data } = props;
  return (
    <Card className="w-full cursor-grab  border-black bg-green-100">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <SquareFunction size={16} />
        <div className="!mt-0">
          <CardTitle className="text-md">Trigger</CardTitle>
          <CardDescription>{data.label}</CardDescription>
        </div>
      </CardHeader>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        className="!h-4 !w-4 border-2 border-white bg-gray-800"
      />
    </Card>
  );
};

const DelayNode = (props: NodeProps<DelayNodeProps>) => {
  const { data } = props;
  return (
    <Card
      className={`w-full cursor-grab border-black ${
        data.connected === undefined
          ? "bg-slate-50"
          : data.connected
          ? "bg-green-100"
          : "bg-red-100"
      }`}>
      <CustomHandle
        type="target"
        position={Position.Top}
        className="!h-4 !w-4 border-2 border-white bg-gray-800"
      />
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Hourglass size={16} />
        <div className="!mt-0">
          <CardTitle className="text-md">Delay Node</CardTitle>
          <CardDescription>You can add delay in between.</CardDescription>
        </div>
      </CardHeader>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        className="!h-4 !w-4 border-2 border-white bg-gray-800"
      />
    </Card>
  );
};

export const EmailNode = (props: NodeProps<EmailNodeProps>) => {
  const { data } = props;
  return (
    <Card
      className={`w-full cursor-grab border-black ${
        data.connected === undefined
          ? "bg-slate-50"
          : data.connected
          ? "bg-green-100"
          : "bg-red-100"
      }`}>
      <CustomHandle
        type="target"
        position={Position.Top}
        className="!h-4 !w-4 border-2 border-white bg-gray-800"
      />
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Mail size={16} />
        <div className="!mt-0">
          <CardTitle className="text-md">Email Node</CardTitle>
          <CardDescription>Add an email to the flow.</CardDescription>
        </div>
      </CardHeader>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        className="!h-4 !w-4 border-2 border-white bg-gray-800"
      />
    </Card>
  );
};

export const ConditionNode = (props: NodeProps<EmailNodeProps>) => {
  const { data } = props;

  return (
    // <div className="relative w-[60px] h-[60px] flex justify-center items-center">
    //   <CustomHandle
    //     className="!z-10"
    //     style={{
    //       zIndex: 1,
    //     }}
    //     type="target"
    //     position={Position.Top}
    //     id="incoming"
    //   />

    //   <div className="z-10 relative text-xs flex justify-center items-center h-full">
    //     Read?
    //   </div>

    //   <div className="absolute left-1/2 top-1/2 w-10 h-10 bg-white border border-[#222] transform -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm" />

    //   <CustomHandle
    //     className="!z-10 !outline !outline-1 !outline-green !bg-green"
    //     type="source"
    //     position={Position.Left}
    //     id="yes"
    //   />

    //   <CustomHandle
    //     className="!z-10 !outline !outline-1 !outline-red !bg-red"
    //     type="source"
    //     position={Position.Right}
    //     id="no"
    //   />
    // </div>
    <Card
      className={`w-full cursor-grab border-black ${
        data.connected === undefined
          ? "bg-slate-50"
          : data.connected
          ? "bg-green-100"
          : "bg-red-100"
      }`}>
      <CustomHandle
        type="target"
        position={Position.Top}
        className="!h-4 !w-4 border-2 border-white bg-gray-800"
      />
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <GitBranch size={16} />
        <div className="!mt-0">
          <CardTitle className="text-md">Condition Node</CardTitle>
          <CardDescription>Whether user opens the mail.</CardDescription>
        </div>
      </CardHeader>
      <CustomHandle
        id="yes"
        type="source"
        position={Position.Left}
        className="!h-4 !w-4 border-2 border-white bg-green-800"
      />
      <CustomHandle
        id="no"
        type="source"
        position={Position.Right}
        className="!h-4 !w-4 border-2 border-white bg-red-800"
      />
    </Card>
  );
};

// Node types object
// eslint-disable-next-line react-refresh/only-export-components
export const nodeTypes = {
  start: StartNode,
  delay: DelayNode,
  email: EmailNode,
  condition: ConditionNode,
};
