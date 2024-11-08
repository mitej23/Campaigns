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

export interface CampaignContact {
  id: string;
  contactId: string;
  campaignId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
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
  trueEmailId: string;
  falseEmailId: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface EmailSendQueue {
  id: string;
  contactId: string;
  emailId: string;
  sendTime: string;
  status: string;
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

export interface Campaign {
  id: string;
  name: string;
  status: string;
  automationFlowEditorData: string;
  userId: string;
  emailAccountsId: string;
  createdAt: string;
  updatedAt: string;
  emailAccount: EmailAccount;
  campaignContacts: CampaignContact[];
  emails: Email[];
}
