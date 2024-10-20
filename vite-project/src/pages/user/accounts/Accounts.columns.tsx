import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CellContext, RowData } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";

export const columns = [
  {
    accessorKey: "emailId",
    header: "Email Account",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: CellContext<RowData, string>) => {
      const status: string = row.getValue("status");
      return (
        <>
          {status === "Pending" ? (
            <p className="text-yellow-500 bg-yellow-100 py-1 px-2 rounded-full w-max text-xs font-semibold border border-yellow-500 ">
              {status}
            </p>
          ) : (
            <p className="text-green-500 bg-green-100 py-1 px-2 rounded-full w-max text-xs font-semibold border border-green-500 ">
              {status}
            </p>
          )}
        </>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
