export interface EmailAccount {
  id: string;
  emailId: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  usersId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignContact {
  id: string;
  contactId: string;
  campaignId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  contact: User;
}

export interface EmailTemplate {
  id: string;
  userId: string;
  name: string;
  subject: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailCondition {
  id: string;
  emailId: string;
  conditionType: string;
  trueEmailId: string | null;
  falseEmailId: string | null;
  trueDelayHours: number | null;
  falseDelayHours: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmailQueue {
  id: string;
  contactId: string;
  emailId: string;
  scheduledTime: string;
  status: string;
  contact: Contact;
  createdAt: string;
  updatedAt: string;
}

export interface EmailSendQueue {
  id: string;
  contactId: string;
  emailId: string;
  sendTime: string;
  status: string;
  contact: Contact;
  createdAt: string;
  updatedAt: string;
}

export interface Email {
  id: string;
  campaignId: string;
  templateId: string;
  delayHours: number;
  parentEmailId: string | null;
  hasCondition: boolean;
  createdAt: string;
  updatedAt: string;
  template: EmailTemplate;
  emailConditions: EmailCondition[];
  emailQueue: EmailQueue[];
  emailSendQueue: EmailSendQueue[];
}

// Node types for automation flow editor
export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeMeasured {
  width: number;
  height: number;
}

export interface NodeData {
  label: string;
  connected?: boolean;
  time?: string;
  format?: string;
  templateId?: string;
}

export interface Node {
  id: string;
  type: string;
  position: NodePosition;
  data: NodeData;
  measured?: NodeMeasured;
  selected?: boolean;
  dragging?: boolean;
  targetPosition?: string;
  sourcePosition?: string;
  anchorPoint?: {
    x: number;
    y: number;
  };
}

export interface Edge {
  source: string;
  target: string;
  type: string;
  style: {
    strokeWidth: number;
    stroke: string;
  };
  id: string;
  sourceHandle?: string;
}

export interface AutomationFlowEditorData {
  nodes: Node[];
  edges: Edge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  automationFlowEditorData: string; // This is a JSON string that should be parsed to AutomationFlowEditorData
  userId: string;
  emailAccountsId: string;
  createdAt: string;
  updatedAt: string;
  emailAccount: EmailAccount;
  campaignContacts: CampaignContact[];
  emails: Email[];
}

// Helper type for parsing automation flow editor data
export interface CampaignWithParsedFlow
  extends Omit<Campaign, "automationFlowEditorData"> {
  automationFlowEditorData: AutomationFlowEditorData;
}
