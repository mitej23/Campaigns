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

const handleStyle = {
  width: "7.5px",
  height: "7.5px",
  outline: "1px solid black",
};

const CustomHandle = (props: HandleProps) => {
  const connections = useHandleConnections({
    type: props.type,
  });

  return <Handle {...props} isConnectable={connections.length < 1} />;
};

const StartNode = (props: NodeProps<StartNodeProps>) => {
  const { data } = props;
  return (
    <div
      className="start node"
      style={{
        // background: data.background || 'white',
        borderColor: data.background || "black",
      }}>
      <div>{data.label}</div>
      <CustomHandle
        type="source"
        style={handleStyle}
        position={Position.Bottom}
      />
    </div>
  );
};

const DelayNode = (props: NodeProps<DelayNodeProps>) => {
  const { data } = props;
  return (
    <div
      className="delay node"
      style={{
        // background: data.background || 'white',
        borderColor: data.background || "black",
      }}>
      <CustomHandle type="target" style={handleStyle} position={Position.Top} />
      <div>Delay</div>
      <select
        value={data.time}
        // onChange={(e) => data.onChange("time", e.target.value)}
      >
        {[...Array(60)].map((_, i) => (
          <option key={i} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      <select
        value={data.format}
        // onChange={(e) => data.onChange("format", e.target.value)}
      >
        <option value="minutes">Minutes</option>
        <option value="hours">Hours</option>
        <option value="days">Days</option>
      </select>
      <CustomHandle
        style={handleStyle}
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
};

export const EmailNode = (props: NodeProps<EmailNodeProps>) => {
  const { data } = props;
  return (
    <div
      className="email node"
      style={{
        // background: data.background || 'white',
        borderColor: data.background || "black",
      }}>
      <CustomHandle style={handleStyle} type="target" position={Position.Top} />
      <div>Email</div>
      <select
        value={data.email}
        // onChange={(e) => data.onChange("email", e.target.value)}
      >
        <option value="email1">Email 1</option>
        <option value="email2">Email 2</option>
        <option value="email3">Email 3</option>
      </select>
      <CustomHandle
        style={handleStyle}
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
};

export const ConditionNode = (props: NodeProps<EmailNodeProps>) => {
  const { data } = props;

  return (
    <div className="relative w-[60px] h-[60px] flex justify-center items-center">
      <CustomHandle
        className="!z-10"
        style={{
          ...handleStyle,
          zIndex: 1,
        }}
        type="target"
        position={Position.Top}
        id="incoming"
      />

      <div className="z-10 relative text-xs flex justify-center items-center h-full">
        Read?
      </div>

      <div
        className="absolute left-1/2 top-1/2 w-10 h-10 bg-white border border-[#222] transform -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm"
        style={{
          borderColor: data.background || "black",
        }}
      />

      <CustomHandle
        className="!z-10 !outline !outline-1 !outline-green !bg-green"
        type="source"
        position={Position.Left}
        id="yes"
      />

      <CustomHandle
        className="!z-10 !outline !outline-1 !outline-red !bg-red"
        type="source"
        position={Position.Right}
        id="no"
      />
    </div>
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
