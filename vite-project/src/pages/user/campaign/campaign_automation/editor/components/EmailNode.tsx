import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, Loader, Mail } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CustomHandle } from "../elements/CustomHandle";
import { NodeProps, Position, useReactFlow } from "@xyflow/react";
import { useEffect, useState } from "react";
import { EmailNodeProps } from "../types/EditorTypes";
import useGetQuery from "@/hooks/useGetQuery";

type EmailTypes = {
  content: string;
  createdAt: string;
  id: string;
  name: string;
  subject: string;
  updatedAt: string;
  userId: string;
};

export const EmailNode = (props: NodeProps<EmailNodeProps>) => {
  const { setNodes } = useReactFlow();
  const { data } = props;
  const { data: emails, isPending } = useGetQuery(
    "/api/email-template",
    "",
    "emailTemplates"
  );
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(data.templateId || "");
  const [emailList, setEmailList] = useState<EmailTypes[]>([]);

  const handleSelectChange = (inputData: string) => {
    const { id } = props;
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              templateId: inputData,
            },
          };
        }

        return node;
      })
    );
  };

  useEffect(() => {
    if (!isPending) {
      if (emails?.data.length > 0) {
        setEmailList(emails.data);
      }
    }
  }, [isPending, emails]);

  return (
    <div
      className={`w-60 cursor-grab border-black border rounded ${
        data.connected === undefined
          ? "bg-slate-50"
          : data.connected
          ? "bg-green-100"
          : "bg-red-100"
      }`}>
      <CustomHandle
        type="target"
        position={Position.Top}
        className="!h-3 !w-3 border-2 border-white bg-gray-800"
      />
      <div className="flex flex-row items-center p-2">
        <Mail size={14} className="mr-2" />
        <h3 className="text-sm font-semibold">Email Node</h3>
      </div>
      <Separator className="border-black border-b-[1px]" />
      <div className="h-full flex flex-col gap-2 p-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium">
            Select Email{" "}
            {!value && (
              <span className="text-red-600">(Email cannot be empty!!)</span>
            )}
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              asChild
              className="py-1.5 px-2 rounded-sm text-xs h-full focus:ring-1 border-gray-800 bg-gray-50 focus:ring-gray-600 focus:ring-offset-1">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={`justify-between font-normal ${
                  !value ? "bg-red-50 border border-red-600" : ""
                }`}>
                {value
                  ? (() => {
                      const name = emailList.find((e) => e.id === value)?.name;
                      return name && name.length > 25
                        ? name.slice(0, 25) + "..."
                        : name;
                    })()
                  : "Select Email Template..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-0">
              <Command>
                <CommandInput placeholder="Search email tempaltes..." />
                <CommandList>
                  {isPending ? (
                    <CommandEmpty>
                      <Loader className="animate-spin" size={20} />
                    </CommandEmpty>
                  ) : (
                    <CommandEmpty>No email templates found.</CommandEmpty>
                  )}
                  <CommandGroup>
                    {emailList.map((e) => (
                      <CommandItem
                        key={e.id}
                        value={e.id}
                        onSelect={(currentValue) => {
                          handleSelectChange(
                            currentValue === value ? "" : currentValue
                          );
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}>
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === e.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {e.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        className="!h-3 !w-3 border-2 border-white bg-gray-800"
      />
    </div>
  );
};
