import { Node } from "@xyflow/react";

export interface CustomNodeType extends Node {
  type: string;
}

export type StartNodeProps = Node<
  {
    label: string;
    connected?: boolean;
  },
  "start"
>;

export type ConditionNodeProps = Node<
  {
    label: string;
    connected?: boolean;
  },
  "start"
>;

export type DelayNodeProps = Node<
  {
    label: string;
    connected?: boolean;
    time?: string;
    format?: string;
  },
  "start"
>;

export type EmailNodeProps = Node<
  {
    label: string;
    connected?: boolean;
    email: string;
    templateId?: string;
  },
  "email"
>;

export interface Email {
  id: string;
  templateId: string;
  delayHours: number;
  parentEmailId: string | null;
  nextEmailId?: string | null; // Optional in some cases
  condition?: {
    type: string;
    trueBranch: {
      emailId: string | null;
    };
    falseBranch: {
      emailId: string | null;
    };
  };
  branch?: string; // Optional, only present in some cases
}
