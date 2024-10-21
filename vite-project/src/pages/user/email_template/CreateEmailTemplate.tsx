import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
// import usePostQuery from "@/hooks/usePostQuery";
// import { toast } from "@/hooks/use-toast";
import DasboardLayout from "@/components/layout/DasboardLayout";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Content } from "@tiptap/core";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateEmailTemplate: React.FC = () => {
  const navigate = useNavigate();
  //   const { mutate, isPending } = usePostQuery("/api/contacts/add-contact");
  const [templateName, setTemplateName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [editorContent, setEditorContent] = useState<Content>("");

  //   const handleCreateEmailTemplate = () => {
  //     if (emailSubject === "" || templateName === "") return;

  //     mutate(
  //       {
  //         name,
  //         email: emailSubject,
  //       },
  //       {
  //         onSuccess: () => {
  //           toast({
  //             title: "Contact added your list Successfully.",
  //             description: "You would be able to send email to this contact.",
  //           });
  //           setClose();
  //           queryClient.invalidateQueries({
  //             queryKey: ["contacts"],
  //           });
  //         },
  //         onError: () => {
  //           toast({
  //             title: "Oops!! Email Account already exists",
  //             description: "Enter different email id..",
  //           });
  //         },
  //       }
  //     );
  //   };

  console.log(editorContent);

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
      <div className="flex flex-col">
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
    </DasboardLayout>
  );
};

export default CreateEmailTemplate;
