import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
// import usePostQuery from "@/hooks/usePostQuery";
// import { toast } from "@/hooks/use-toast";
import DasboardLayout from "@/components/layout/DasboardLayout";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Content } from "@tiptap/core";
import { ChevronLeft, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/App";
import usePostQuery from "@/hooks/usePostQuery";

const CreateEmailTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = usePostQuery(
    "/api/email-template/create-email-template"
  );
  const [templateName, setTemplateName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [editorContent, setEditorContent] = useState<Content>("");

  const handleCreateEmailTemplate = () => {
    if (emailSubject === "" || templateName === "" || editorContent === "")
      return;

    mutate(
      {
        name: templateName,
        subject: emailSubject,
        content: editorContent,
      },
      {
        onSuccess: () => {
          navigate("/email-templates");
          toast({
            title: "Email Template added Successfully.",
            description: "You would be able to send email using this template.",
          });
          queryClient.invalidateQueries({
            queryKey: ["emailTemplates"],
          });
        },
        onError: () => {
          toast({
            title: "Name, subject and email template cannot be empty",
            description: "Please fill the input boxes...",
          });
        },
      }
    );
  };

  return (
    <DasboardLayout>
      <div
        className="flex items-center mb-4 hover:cursor-pointer w-max"
        onClick={() => navigate("/email-templates")}>
        <ChevronLeft size={18} />{" "}
        <p className="ml-2 hover:underline underline-offset-2">Back</p>
      </div>
      <div className="flex flex-row items-end justify-between mb-6">
        <h1 className="text-2xl font-semibold">Create Email Template</h1>
      </div>
      <div className="flex flex-col mb-4">
        <div className="w-full mb-4">
          <Label htmlFor="name" className="text-right">
            Email Template Name
          </Label>
          <Input
            id="name"
            placeholder="Enter template name..."
            className="mt-2"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </div>
        <div className="w-full mb-4">
          <Label htmlFor="name" className="text-right">
            Subject
          </Label>
          <Input
            id="name"
            placeholder="Enter subject..."
            className="mt-2"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="name" className="text-right">
            Your Mail
          </Label>
          <MinimalTiptapEditor
            value={editorContent}
            onChange={setEditorContent}
            className="w-full mt-2"
            editorContentClassName="p-5"
            output="html"
            placeholder="Type your description here..."
            autofocus={true}
            editable={true}
            editorClassName="focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-end">
        <Button
          size={"sm"}
          type="submit"
          className="w-max ml-auto"
          disabled={
            emailSubject === "" || templateName === "" || editorContent === ""
              ? true
              : false
          }
          onClick={handleCreateEmailTemplate}>
          {isPending ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            "Create Email Template"
          )}
        </Button>
      </div>
    </DasboardLayout>
  );
};

export default CreateEmailTemplate;
