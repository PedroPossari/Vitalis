'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { flexRender, Table as TableType } from '@tanstack/react-table';
import { ColumnHeader } from './column-header';
import { TablePagination } from './table-pagination';
import { useRouter } from 'next/navigation';

interface RowWithId {
    id: string | number;
}

interface DataTableProps<TData extends RowWithId> {
    table: TableType<TData>;
    name: string;
}

export default function DataTable<TData extends RowWithId>({ table, name }: DataTableProps<TData>) {
    const router = useRouter();

    return (
        <div className="bg-[#131619] rounded-xl overflow-hidden">
            <Table>
                <TableHeader className="bg-[#1a1d21] text-[#cdcecf]">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className="border-b border-[#1c2023] hover:bg-transparent"
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="py-4 px-6 text-[#cdcecf]">
                                    {header.isPlaceholder || header == null
                                        ? null
                                        : flexRender(
                                              <ColumnHeader column={header.column} />,
                                              header.getContext(),
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="border-b border-[#1c2023] hover:bg-[#1a1d21]"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        onClick={() => {
                                            if (cell.column.id === 'actions') {
                                                return;
                                            } else {
                                                router.push(`/${name}/${cell.row.original.id}`);
                                            }
                                        }}
                                        className={`py-4 px-6 ${
                                            cell.column.id === 'actions' ? '' : 'cursor-pointer'
                                        }`}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={table.getAllColumns().length}
                                className="h-24 text-center"
                            >
                                Nenhum resultado encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination table={table} />
        </div>
    );
}
