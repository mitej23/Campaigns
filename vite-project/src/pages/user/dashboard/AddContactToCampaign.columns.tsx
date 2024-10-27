import { Checkbox } from "@/components/ui/checkbox";
import { CellContext, RowData, Table } from "@tanstack/react-table";

interface ContactRowData {
  id: string;
  name: string;
  email: string;
}

export const columns = [
  {
    id: "select",
    header: ({ table }: { table: Table<RowData> }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: CellContext<RowData, ContactRowData>) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        disabled={!row.getCanSelect()}
        aria-label="Select row"
      />
    ),
    enableGlobalFilter: false,
  },
  {
    accessorKey: "name",
    header: "Contact Name",
  },
  {
    accessorKey: "email",
    header: "Email Account",
  },
];
