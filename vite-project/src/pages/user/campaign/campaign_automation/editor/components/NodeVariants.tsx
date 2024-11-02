import { StartNode } from "./StartNode";
import { DelayNode } from "./DelayNode";
import { EmailNode } from "./EmailNode";
import { ConditionNode } from "./ConditionNode";

// Node types object
// eslint-disable-next-line react-refresh/only-export-components
export const nodeTypes = {
  start: StartNode,
  delay: DelayNode,
  email: EmailNode,
  condition: ConditionNode,
};
