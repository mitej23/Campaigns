import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";

const usePostQuery = (url: string) => {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (data: unknown) => {
      const requestOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        redirect: "follow" as RequestRedirect,
        credentials: "include",
      };
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${url}`,
        requestOptions
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Some Error");
      }

      return response.json();
    },
    onSuccess: async (data) => {
      console.log(data);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });
  return {
    mutate,
    isPending,
    isError,
    error,
  };
};

export default usePostQuery;
