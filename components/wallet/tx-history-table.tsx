import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TxRecord } from "@/lib/types";

interface TxHistoryTableProps {
  rows: TxRecord[];
}

function statusVariant(status: TxRecord["status"]) {
  switch (status) {
    case "Success":
      return "secondary" as const;
    case "Pending":
      return "warning" as const;
    default:
      return "destructive" as const;
  }
}

export function TxHistoryTable({ rows }: TxHistoryTableProps) {
  return (
    <div className="rounded-2xl border border-[#e1e7f2] bg-white">
      <div className="flex items-center justify-between border-b border-[#edf1f8] px-5 py-4">
        <h3 className="text-[27px] font-bold text-[#1a233a]">Transaction History</h3>
        <div className="flex items-center gap-2 text-sm text-[#7d88a2]">
          <button className="rounded-lg border border-[#dce3ef] px-3 py-1.5 hover:bg-[#f6f9ff]">Filter</button>
          <button className="rounded-lg border border-[#dce3ef] px-3 py-1.5 hover:bg-[#f6f9ff]">Export</button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tx Hash</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#28324a]">{new Date(row.date).toLocaleDateString()}</span>
                  <span className="text-xs text-[#95a0b8]">{new Date(row.date).toLocaleTimeString()}</span>
                </div>
              </TableCell>
              <TableCell className="font-semibold">{row.action}</TableCell>
              <TableCell className={row.amountEth.startsWith("+") ? "font-semibold text-[#12a265]" : "font-semibold text-[#f04438]"}>
                {row.amountEth} ETH
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
              </TableCell>
              <TableCell>
                {row.explorerUrl ? (
                  <Link href={row.explorerUrl} target="_blank" className="font-semibold text-[#7b2ff7] hover:underline">
                    {row.txHash}
                  </Link>
                ) : (
                  <span className="font-semibold text-[#7b2ff7]">{row.txHash}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t border-[#edf1f8] px-5 py-3 text-sm text-[#8690a7]">
        <p>Showing {rows.length} transactions</p>
        <div className="flex gap-2">
          <button className="rounded-lg border border-[#dce3ef] px-3 py-1">Previous</button>
          <button className="rounded-lg border border-[#dce3ef] px-3 py-1">Next</button>
        </div>
      </div>
    </div>
  );
}
