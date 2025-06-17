import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
}

export function ColumnHeader<TData, TValue>({
    column,
    className,
}: ColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{column.columnDef.header?.toString() ?? null}</div>;
    }

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 data-[state=open]:bg-accent"
                onClick={() =>
                    column.getIsSorted() == 'asc'
                        ? column.toggleSorting(true)
                        : column.toggleSorting(false)
                }
            >
                <span>{column.columnDef.header?.toString() ?? null}</span>
                {column.getIsSorted() === 'desc' ? (
                    <ArrowUp />
                ) : column.getIsSorted() === 'asc' ? (
                    <ArrowDown />
                ) : (
                    <ChevronsUpDown />
                )}
            </Button>
        </div>
    );
}
