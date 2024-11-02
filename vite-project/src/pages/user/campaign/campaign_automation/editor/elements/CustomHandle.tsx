import { Handle, HandleProps, useHandleConnections } from "@xyflow/react";

export const CustomHandle = (props: HandleProps) => {
  const connections = useHandleConnections({
    type: props.type,
  });

  return <Handle {...props} isConnectable={connections.length < 1} />;
};
