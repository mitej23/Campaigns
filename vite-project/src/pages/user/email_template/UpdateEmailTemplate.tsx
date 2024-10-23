import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
// import usePostQuery from "@/hooks/usePostQuery";
// import { toast } from "@/hooks/use-toast";
import DasboardLayout from "@/components/layout/DasboardLayout";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Content } from "@tiptap/core";
import { ChevronLeft, Loader } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { queryClient } from "@/App";
import usePostQuery from "@/hooks/usePostQuery";
import useGetQuery from "@/hooks/useGetQuery";
import { Skeleton } from "@/components/ui/skeleton";

const UpdateEmailTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [templateId, setTemplateId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [editorContent, setEditorContent] = useState<Content>("");
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  const { data, isPending: fetching } = useGetQuery(
    `/api/email-template/${id}`,
    id || "",
    `emailTemplates`
  );
  const { mutate, isPending } = usePostQuery(
    "/api/email-template/update-email-template"
  );

  const handleUpdateEmailTemplate = () => {
    if (emailSubject === "" || templateName === "" || editorContent === "")
      return;

    mutate(
      {
        templateId,
        name: templateName,
        subject: emailSubject,
        content: editorContent,
      },
      {
        onSuccess: () => {
          navigate("/email-templates");
          toast({
            title: "Email Template updated   Successfully.",
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

  useEffect(() => {
    if (!fetching) {
      if (data?.data.length > 0) {
        const { name, subject, content, id } = data.data[0];
        console.log(content);
        setTemplateName(name);
        setEmailSubject(subject);
        setEditorContent("");
        setTimeout(() => {
          setEditorContent(content);
        }, 0);
        setTemplateId(id);
        setTimeout(() => {
          setIsEditorLoading(false);
        }, 200);
      }
    }
  }, [fetching, data]);

  return (
    <DasboardLayout>
      <>
        {fetching ? (
          <div className="h-[80vh] flex items-center justify-center">
            <Loader className="animate-spin" size={20} />
          </div>
        ) : (
          <>
            <div
              className="flex items-center mb-4 hover:cursor-pointer w-max"
              onClick={() => navigate("/email-templates")}>
              <ChevronLeft size={18} />{" "}
              <p className="ml-2 hover:underline underline-offset-2">Back</p>
            </div>
            <div className="flex flex-row items-end justify-between mb-6">
              <h1 className="text-2xl font-semibold">Update Email Template</h1>
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
                {isEditorLoading ? (
                  <Skeleton className="h-72 w-full mt-2" />
                ) : (
                  <MinimalTiptapEditor
                    key={templateId} // Add a key to force remount when template changes
                    value={editorContent}
                    onChange={setEditorContent}
                    className="w-full mt-2"
                    editorContentClassName="p-5"
                    output="html"
                    placeholder="Type your description here..."
                    autofocus={false} // Changed to false to prevent focus jumping
                    editable={true}
                    editorClassName="focus:outline-none"
                  />
                )}
              </div>
            </div>
            <div className="flex items-end">
              <Button
                size={"sm"}
                type="submit"
                className="w-max ml-auto"
                disabled={
                  emailSubject === "" ||
                  templateName === "" ||
                  editorContent === ""
                    ? true
                    : false
                }
                onClick={handleUpdateEmailTemplate}>
                {isPending ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  "Update Email Template"
                )}
              </Button>
            </div>
          </>
        )}
      </>
    </DasboardLayout>
  );
};

export default UpdateEmailTemplate;
