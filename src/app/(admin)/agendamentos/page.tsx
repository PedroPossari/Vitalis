'use client';
import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    ColumnFiltersState,
} from '@tanstack/react-table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import DataTable from '@/components/ui/data-table';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { Search, Pencil, Trash2, Plus, LoaderCircle, AlertTriangle } from 'lucide-react';
import { Prisma } from '@prisma/client';
import useSWR, { mutate } from 'swr';
import { deleteAgendamento, getAgendamentos } from '@/actions/agendamentoService';
import { toast } from 'sonner';

type Agendamento = Prisma.AgendamentoGetPayload<{
    include: {
        paciente: true;
        medico: true;
    };
}>;

export default function Page() {
    const router = useRouter();
    const [agendamento, setAgendamento] = React.useState<Agendamento | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const columns = React.useMemo<ColumnDef<Agendamento>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
            },
            {
                accessorKey: 'paciente.nome',
                header: 'Paciente',
                cell: ({ row }) => {
                    const paciente = row.original.paciente;
                    return (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-secondary-background">
                                {paciente?.nome.slice(0, 2)}
                            </div>
                            <span>{paciente?.nome}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'dataHora',
                header: 'Data',
                cell: ({ row }) => {
                    const dataHora = new Date(row.original.dataHora);
                    const options: Intl.DateTimeFormatOptions = {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    };
                    return (
                        <span>
                            {dataHora.toLocaleDateString('pt-BR', options).replace(',', '')}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const status = row.original.status;
                    const getStatusColor = (value: string) => {
                        switch (value) {
                            case 'Concluído':
                                return '#4ac97e';
                            case 'Agendado':
                                return '#79b5ec';
                            case 'Cancelado':
                                return '#ff4f4e';
                            default:
                                return '#4ac97e';
                        }
                    };
                    const color = getStatusColor(status);
                    return (
                        <div className="flex items-center gap-2">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: color }}
                            ></div>
                            <span style={{ color }}>{status}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'medico.nome',
                header: 'Médico',
                cell: ({ row }) => {
                    const medico = row.original.medico;
                    return (
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{medico?.nome.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span>{medico?.nome}</span>
                        </div>
                    );
                },
            },
            {
                id: 'actions',
                header: 'Ações',
                enableSorting: false,
                cell: ({ row }) => {
                    return (
                        <div className="flex justify-start w-full gap-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() =>
                                                router.push(
                                                    `/agendamentos/editar/${row.original.id}`,
                                                )
                                            }
                                        >
                                            <Pencil />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Editar</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            onClick={() => {
                                                setAgendamento(row.original);
                                                setIsOpen(true);
                                            }}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-destructive">
                                        Deletar
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    );
                },
            },
        ],
        [router],
    );

    const { data, error, isLoading } = useSWR<Agendamento[]>('/agendamentos', getAgendamentos);

    const [globalFilter, setGlobalFilter] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data: data ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: 'includesString',
        state: {
            sorting,
            globalFilter,
        },
    });

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 px-4 max-w-3xl bg-background min-h-screen">
                <div className="flex justify-center items-center h-full">
                    <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="container mx-auto py-10 px-4 max-w-3xl bg-background min-h-screen">
                <div className="flex justify-center items-center h-full">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                    <p className="text-red-500">Erro ao carregar os agendamentos!</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar Agendamento</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar este agendamento?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setAgendamento(null);
                                }}
                            >
                                Cancelar
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                onClick={async () => {
                                    if (!agendamento) return;
                                    try {
                                        const res = await deleteAgendamento(agendamento.id);
                                        if (!res) {
                                            toast.error('Erro ao deletar agendamento!');
                                        } else {
                                            mutate('/agendamentos');
                                            toast.success('Agendamento deletado com sucesso!');
                                        }
                                    } catch {
                                        toast.error('Erro ao deletar agendamento!');
                                    }
                                    setIsOpen(false);
                                    setAgendamento(null);
                                }}
                                variant="destructive"
                            >
                                <Trash2 />
                                Deletar
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="flex flex-col md:flex-row gap-4 my-2">
                <div className="w-full">
                    <Input
                        Icon={Search}
                        placeholder="Pesquisar por paciente, data, médico..."
                        className="bg-[#131619] border-[#1c2023] text-white h-10 rounded-lg focus:ring-[#79b5ec] focus:border-[#79b5ec]"
                        value={globalFilter.toString()}
                        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
                    />
                </div>
                <div className="flex">
                    <Button className="h-full" onClick={() => router.push('/agendamentos/criar')}>
                        <Plus />
                        <p>Adicionar Agendamento</p>
                    </Button>
                </div>
            </div>
            <DataTable table={table} name="agendamentos" />
        </>
    );
}
