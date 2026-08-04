import { TableCell, TableRow } from "../ui/table";

export default function NoDataTable({
  colSpan,
  noDataTableText,
}: {
  colSpan: number;
  noDataTableText: string;
}) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-10">
        {noDataTableText}
      </TableCell>
    </TableRow>
  );
}
