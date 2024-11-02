import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitBranch, Hourglass, LayoutPanelTop, Mail } from "lucide-react";

type EditorSideComponentsContainerProps = {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, type: string) => void;
  onLayout: () => void;
};

interface NodeConfig {
  key: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const nodeConfigs: NodeConfig[] = [
  {
    key: "delay",
    icon: Hourglass,
    title: "Delay",
    description: "Attach delay to email.",
  },
  {
    key: "email",
    icon: Mail,
    title: "Email",
    description: "Attach an email to your campaign",
  },
  {
    key: "condition",
    icon: GitBranch,
    title: "Condition",
    description: "Create view condition.",
  },
];

const EditorSideComponentsContainer: React.FC<
  EditorSideComponentsContainerProps
> = ({ onDragStart, onLayout }) => {
  return (
    <div className="flex flex-col gap-4 h-full max-w- p-4">
      <h4 className="text-lg font-bold ">Components</h4>
      {nodeConfigs.map((node) => {
        const Icon = node.icon;
        return (
          <Card
            key={node.key}
            draggable
            className="w-full cursor-grab border-black bg-slate-50"
            onDragStart={(event) => onDragStart(event, node.key)}>
            <CardHeader className="flex flex-row items-center gap-4 p-4">
              <Icon size={16} />
              <div className="!mt-0">
                <CardTitle className="text-md">{node.title}</CardTitle>
                <CardDescription>{node.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        );
      })}
      <Button variant={"outline"} onClick={onLayout}>
        Align Nodes
        <LayoutPanelTop className="ml-4" size={14} />
      </Button>
    </div>
  );
};

export default EditorSideComponentsContainer;
