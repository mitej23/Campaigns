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
  delay_hours: number;
  parent_email_id: string | null;
  next_email_id?: string | null; // Optional in some cases
  condition?: {
    type: string;
    true_branch: {
      email_id: string | null;
    };
    false_branch: {
      email_id: string | null;
    };
  };
  branch?: string; // Optional, only present in some cases
}
