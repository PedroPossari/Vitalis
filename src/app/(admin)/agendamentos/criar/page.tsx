'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormField,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { createAgendamento } from '@/actions/agendamentoService';
import { toast } from 'sonner';
import { AgendamentoForm, agendamentoSchema } from '@/types/agendamento';
import { getPacientes } from '@/actions/pacienteService';
import useSWR, { mutate } from 'swr';
import { getMedicos } from '@/actions/medicoService';
import { AlertTriangle, ChevronLeft, LoaderCircle, Plus } from 'lucide-react';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();

    const [isSubmitting, setSubmitting] = useState(false);
    const {
        data: pacientes,
        error: pacienteError,
        isLoading: pacienteLoading,
    } = useSWR('/pacientes', getPacientes);
    const {
        data: medicos,
        error: medicoError,
        isLoading: medicoLoading,
    } = useSWR('/medicos', getMedicos);

    const form = useForm<AgendamentoForm>({
        resolver: zodResolver(agendamentoSchema),
        defaultValues: {
            observacoes: '',
            status: 'Agendado',
        },
    });

    async function onSubmit(data: AgendamentoForm) {
        setSubmitting(true);
        try {
            const res = await createAgendamento(data);
            if (res) {
                mutate('/agendamentos');
                router.replace('/agendamentos');
                toast.success('Agendamento cadastrado com sucesso!');
            } else {
                toast.error('Erro ao criar agendamento!');
            }
        } catch {
            toast.error('Erro ao criar agendamento!');
        }
        setSubmitting(false);
    }

    if (pacienteLoading || medicoLoading) {
        return (
            <div className="container mx-auto py-10 px-4 max-w-3xl bg-background min-h-screen">
                <div className="flex justify-center items-center h-full">
                    <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
                </div>
            </div>
        );
    }

    if (pacienteError || medicoError || !pacientes || !medicos) {
        return (
            <div className="container mx-auto py-10 px-4 max-w-3xl bg-background min-h-screen">
                <div className="text-red-500 text-center">
                    <AlertTriangle className="inline-block mr-2" color="red" />
                    Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.
                </div>
            </div>
        );
    }

    return (
        <div className="container bg-background h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Novo Agendamento</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Informações do Agendamento */}
                    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                        <div className="md:col-span-2">
                            <div className="border-b border-border pb-2 mb-6">
                                <h2 className="text-xl font-bold text-card-foreground">
                                    Informações do Agendamento
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <DateTimePicker
                                mode="dateTime"
                                name="dataHora"
                                control={form.control}
                                label="Data e Hora"
                                placeholder="Selecione a data e hora do agendamento"
                            />

                            <FormField
                                control={form.control}
                                name="pacienteId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full">
                                        <FormLabel>Paciente</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione um paciente" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-60">
                                                {pacientes.map((paciente) => (
                                                    <SelectItem
                                                        key={paciente.id}
                                                        value={paciente.id.toString()}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-secondary-background">
                                                                {paciente.nome.slice(0, 2)}
                                                            </div>
                                                            <span>{paciente.nome}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="medicoId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full">
                                        <FormLabel>Médico</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione um médico" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-60">
                                                {medicos.map((medico) => (
                                                    <SelectItem
                                                        key={medico.id}
                                                        value={medico.id.toString()}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-secondary-background">
                                                                {medico.nome.slice(0, 2)}
                                                            </div>
                                                            <span>{medico.nome}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="md:col-span-3">
                                <FormField
                                    control={form.control}
                                    name="observacoes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Observações Adicionais</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Digite observações sobre o agendamento (opcional)"
                                                    className="resize-none min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between pb-5">
                        <Button
                            disabled={isSubmitting}
                            variant="outline"
                            className="px-6"
                            onClick={() => router.back()}
                        >
                            <ChevronLeft />
                            Voltar
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="px-6">
                            <Plus />
                            {isSubmitting ? 'Criando...' : 'Criar Agendamento'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
