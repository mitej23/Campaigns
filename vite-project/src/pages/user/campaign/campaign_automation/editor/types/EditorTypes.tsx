import { Node } from "@xyflow/react";

export interface CustomNodeType extends Node {
  type: string;
}

export type StartNodeProps = Node<
  {
    label: string;
    background: string;
  },
  "start"
>;

export type DelayNodeProps = Node<
  {
    label: string;
    background: string;
    time: string;
    format: string;
  },
  "start"
>;

export type EmailNodeProps = Node<
  {
    label: string;
    background: string;
    email: string;
  },
  "email"
>;
