import React, { useState } from "react";
import { ChevronRight, ChevronDown, Mail, AlertCircle } from "lucide-react";
import { Email } from "@/types/CampaignTypes";

interface EmailTreeNode extends Email {
  children: EmailTreeNode[];
  isVisited?: boolean;
  isTrue?: boolean;
  isFalse?: boolean;
}

// Type for the root emails array
type RootEmails = EmailTreeNode[];

// Helper function to build tree structure
const buildEmailTree = (emails: Email[]): RootEmails => {
  const emailMap = new Map<string, EmailTreeNode>();
  const rootEmails: RootEmails = [];
  const visited = new Set<string>();

  // Create map of all emails with visited tracking
  emails.forEach((email) => {
    emailMap.set(email.id, {
      ...email,
      children: [],
      isVisited: false,
    });
  });

  // Process conditional relationships first
  const processConditions = (email: Email, node: EmailTreeNode): void => {
    if (visited.has(email.id)) {
      return; // Prevent circular references
    }
    visited.add(email.id);

    if (email.emailConditions && email.emailConditions.length > 0) {
      const condition = email.emailConditions[0];

      // Process true branch
      if (condition.trueEmailId) {
        const trueNode = emailMap.get(condition.trueEmailId);
        if (trueNode && !visited.has(trueNode.id)) {
          const trueChild: EmailTreeNode = { ...trueNode, isTrue: true };
          node.children.push(trueChild);
          // Recursively process conditions in the true branch
          processConditions(trueNode, trueChild);
        }
      }

      // Process false branch
      if (condition.falseEmailId) {
        const falseNode = emailMap.get(condition.falseEmailId);
        if (falseNode && !visited.has(falseNode.id)) {
          const falseChild: EmailTreeNode = { ...falseNode, isFalse: true };
          node.children.push(falseChild);
          // Recursively process conditions in the false branch
          processConditions(falseNode, falseChild);
        }
      }
    }
  };

  // Build the sequential structure first
  const sequentialEmails: Email[] = [];
  let currentEmail = emails.find((e) => !e.parentEmailId);

  while (currentEmail) {
    sequentialEmails.push(currentEmail);
    // Fix: Handle the case where currentEmail might be undefined
    const nextEmail = currentEmail.id
      ? emails.find((e) => e.parentEmailId === currentEmail?.id)
      : undefined;
    currentEmail = nextEmail;
  }

  // Create the main sequence
  sequentialEmails.forEach((email, index) => {
    const node = emailMap.get(email.id);

    if (node) {
      if (index === 0) {
        rootEmails.push(node);
      }

      // Process conditions for each email in the sequence
      processConditions(email, node);

      // If there's a next sequential email and it's not already processed as a condition
      if (index < sequentialEmails.length - 1) {
        const nextEmail = sequentialEmails[index + 1];
        if (!visited.has(nextEmail.id)) {
          const nextNode = emailMap.get(nextEmail.id);
          if (nextNode) {
            rootEmails.push(nextNode);
          }
        }
      }
    }
  });

  return rootEmails;
};

interface EmailNodeProps {
  email: EmailTreeNode;
  depth?: number;
}

const EmailNode: React.FC<EmailNodeProps> = ({ email, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const hasChildren = email.children && email.children.length > 0;

  return (
    <div className="ml-4">
      <div
        className={`
          flex items-center gap-2 p-2 rounded-lg
          hover:bg-gray-100 transition-colors
          ${depth === 0 ? "ml-0" : "ml-6 relative"}
        `}>
        {/* Vertical line connector */}
        {depth > 0 && (
          <div
            className="absolute left-0 top-0 h-full w-px bg-gray-300"
            style={{ left: "-1.5rem" }}
          />
        )}

        {/* Horizontal line connector */}
        {depth > 0 && (
          <div
            className="absolute w-6 h-px bg-gray-300"
            style={{ left: "-1.5rem", top: "50%" }}
          />
        )}

        {/* Email node content */}
        <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {hasChildren ? (
            isOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )
          ) : (
            <Mail className="h-4 w-4 text-gray-500" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{email.template.name}</span>
            {email.emailConditions?.length > 0 && (
              <AlertCircle className="h-4 w-4 text-amber-500" />
            )}
          </div>
          <div className="text-sm text-gray-500">
            {Math.floor(email.delayHours / 60)}h{" "}
            {Math.floor(email.delayHours % 60)}mins
            {(email.isTrue || email.isFalse) && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100">
                {email.isTrue ? "Opened" : "Not Opened"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Render children recursively */}
      {isOpen && hasChildren && (
        <div className="space-y-2">
          {email.children.map((child) => (
            <EmailNode key={child.id} email={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const EmailTreeView: React.FC<{ emails: Email[] }> = ({ emails }) => {
  const emailTree = buildEmailTree(emails);

  return (
    <div className="p-4 space-y-4 border rounded-md">
      {emailTree.map((rootEmail) => (
        <EmailNode key={rootEmail.id} email={rootEmail} />
      ))}
    </div>
  );
};

export default EmailTreeView;
