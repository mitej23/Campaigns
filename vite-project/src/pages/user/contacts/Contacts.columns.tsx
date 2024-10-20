import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/useModal";
import { CellContext, RowData } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import UpdateContact from "./UpdateContact.dialog";

interface ContactRowData {
  id: string;
  name: string;
  email: string;
}

export const columns = [
  {
    accessorKey: "name",
    header: "Contact Name",
  },
  {
    accessorKey: "email",
    header: "Email Account",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function CellComponent({ row }: CellContext<RowData, string>) {
      const { id, name, email } = row.original as ContactRowData;
      const { setOpen } = useModal();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                setOpen(
                  <UpdateContact
                    key={Math.random()}
                    id={id}
                    name={name}
                    email={email}
                  />
                )
              }>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
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
