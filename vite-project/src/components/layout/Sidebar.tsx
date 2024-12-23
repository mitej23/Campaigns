import { AtSign, LayoutDashboard, Mails, Send, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import usePostQuery from "@/hooks/usePostQuery";
import { queryClient } from "@/App";

const Sidebar = () => {
  const { mutate } = usePostQuery("/api/users/logout");
  const { logout } = useAuth();
  const navigate = useNavigate();
  const links = [
    {
      id: 0,
      name: "Sent",
      path: "/emails",
      icon: <Send size={20} className="mr-4 h-4 w-4" />,
    },
    {
      id: 1,
      name: "Dasboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} className="mr-4 h-4 w-4" />,
    },
    {
      id: 2,
      name: "Accounts",
      path: "/accounts",
      icon: <AtSign size={20} className="mr-4 h-4 w-4" />,
    },
    {
      id: 3,
      name: "Contacts",
      path: "/contacts",
      icon: <User size={20} className="mr-4 h-4 w-4" />,
    },
    {
      id: 4,
      name: "Email Templates",
      path: "/email-templates",
      icon: <Mails size={20} className="mr-4 h-4 w-4" />,
    },
  ];

  const handleLogout = () => {
    mutate(
      {},
      {
        onSuccess: () => {
          queryClient.clear();
          logout();
        },
      }
    );
  };

  return (
    <div className="flex flex-col bg-gray-50 h-screen w-[220px] border-r fixed">
      <h1
        className="text-3xl font-semibold text-center mt-8 hover:cursor-pointer"
        onClick={() => navigate("/")}>
        Campaigns
      </h1>
      <div className="flex flex-col mt-8 gap-1 flex-1 mb-4">
        {links.map(({ id, name, path, icon }) => {
          return (
            <NavLink
              key={id}
              className={({ isActive }) =>
                cn(
                  isActive
                    ? buttonVariants({ variant: "default", size: "sm" })
                    : buttonVariants({ variant: "ghost", size: "sm" }),
                  `${isActive ? "" : " "} justify-start mx-4 `
                )
              }
              to={path}>
              {icon}
              {name}
            </NavLink>
          );
        })}
        <div className="mt-auto mx-4">
          <Button
            size={"sm"}
            onClick={handleLogout}
            className="w-full bg-red-50 border-red-200 text-red-400 hover:bg-red-200 hover:text-red-500"
            variant="outline">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
