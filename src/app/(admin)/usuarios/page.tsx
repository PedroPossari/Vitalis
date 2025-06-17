'use client';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Usuario } from '@prisma/client';
import {
    ColumnDef,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
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
import { AlertTriangle, LoaderCircle, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import useSWR, { mutate } from 'swr';
import { toast } from 'sonner';
import { deleteUsuario, getUsuarios } from '@/actions/usuarioService';

export default function Page() {
    const router = useRouter();
    const { data, error, isLoading } = useSWR('/usuarios', getUsuarios);
    const [usuario, setUsuario] = React.useState<Usuario | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);

    const columns = React.useMemo<ColumnDef<Usuario>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
            },
            {
                accessorKey: 'nome',
                header: 'Nome',
                cell: ({ row }) => {
                    const nome = row.original.nome;
                    return (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-secondary-background">
                                {nome.slice(0, 2)}
                            </div>
                            <span>{nome}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'email',
                header: 'Email',
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
                                                router.push(`/usuarios/editar/${row.original.id}`)
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
                                                setUsuario(row.original);
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

    const [globalFilter, setGlobalFilter] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable<Usuario>({
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
        return <LoaderCircle className="animate-spin" />;
    }

    if (error || !data) {
        return (
            <div className="flex w-full h-full items-center justify-center">
                <AlertTriangle color="red" />
                <p>Erro ao buscar usuários!</p>
            </div>
        );
    }

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deletar Usuário</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja deletar este usuário?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setUsuario(null);
                                }}
                            >
                                Cancelar
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                onClick={async () => {
                                    if (!usuario) return;
                                    try {
                                        const res = await deleteUsuario(usuario.id);
                                        if (!res) {
                                            toast.error('Erro ao deletar usuário!');
                                        } else {
                                            mutate('/usuarios');
                                            toast.success('Usuário deletado com sucesso!');
                                        }
                                    } catch {
                                        toast.error('Erro ao deletar usuário!');
                                    }
                                    setIsOpen(false);
                                    setUsuario(null);
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
                        placeholder="Pesquisar por nome, email, telefone..."
                        className="bg-[#131619] border-[#1c2023] text-white h-10 rounded-lg focus:ring-[#79b5ec] focus:border-[#79b5ec]"
                        value={globalFilter.toString()}
                        onChange={(e) => table.setGlobalFilter(String(e.target.value))}
                    />
                </div>
                <div className="flex">
                    <Button className="h-full" onClick={() => router.push('/usuarios/criar')}>
                        <Plus />
                        <p>Adicionar Usuário</p>
                    </Button>
                </div>
            </div>
            <DataTable table={table} name="usuarios" />
        </>
    );
}
