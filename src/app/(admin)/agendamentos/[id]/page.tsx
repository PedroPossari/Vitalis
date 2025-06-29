'use client';
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
import { getAgendamentoById } from '@/actions/agendamentoService';
import { AgendamentoForm } from '@/types/agendamento';
import { getPacientes } from '@/actions/pacienteService';
import useSWR from 'swr';
import { getMedicos } from '@/actions/medicoService';
import { AlertTriangle, ChevronLeft, LoaderCircle, Pencil } from 'lucide-react';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { useParams, useRouter } from 'next/navigation';

export default function Page() {
    const { id } = useParams();
    const router = useRouter();

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

    const {
        data: agendamento,
        error: agendamentoError,
        isLoading: agendamentoLoading,
    } = useSWR(['/agendamentos', id], ([_url, id]) => getAgendamentoById(Number(id)));

    const form = useForm<AgendamentoForm>({
        disabled: true,
        defaultValues: {
            observacoes: '',
            status: '',
            dataHora: undefined,
            pacienteId: undefined,
            medicoId: undefined,
        },
        values: {
            observacoes: agendamento?.observacoes ?? '',
            status: agendamento?.status ?? '',
            dataHora: agendamento?.dataHora ? new Date(agendamento.dataHora) : new Date(),
            pacienteId: agendamento?.pacienteId ?? 0,
            medicoId: agendamento?.medicoId ?? 0,
        },
        
    });

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

    if (pacienteLoading || medicoLoading || agendamentoLoading) {
        return (
            <div className="container mx-auto py-10 px-4 max-w-3xl bg-background min-h-screen">
                <div className="flex justify-center items-center h-full">
                    <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
                </div>
            </div>
        );
    }

    if (
        pacienteError ||
        medicoError ||
        agendamentoError ||
        !pacientes ||
        !medicos ||
        !agendamento
    ) {
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
                <h1 className="text-2xl font-bold text-foreground">Visualizar Agendamento</h1>
            </div>

            <Form {...form}>
                <form className="space-y-8">
                    {/* Informações do Agendamento */}
                    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                        <div className="md:col-span-2">
                            <div className="border-b border-border pb-2 mb-6">
                                <h2 className="text-xl font-bold text-card-foreground">
                                    Informações do Agendamento
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DateTimePicker
                                disabled
                                mode="dateTime"
                                name="dataHora"
                                control={form.control}
                                label="Data e Hora"
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full">
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            disabled
                                            onValueChange={field.onChange}
                                            defaultValue={agendamento?.status}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione o status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Agendado">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-2 h-2 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    getStatusColor('Agendado'),
                                                            }}
                                                        ></div>
                                                        <span
                                                            style={{
                                                                color: getStatusColor('Agendado'),
                                                            }}
                                                        >
                                                            Agendado
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Concluído">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-2 h-2 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    getStatusColor('Concluído'),
                                                            }}
                                                        ></div>
                                                        <span
                                                            style={{
                                                                color: getStatusColor('Concluído'),
                                                            }}
                                                        >
                                                            Concluído
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="Cancelado">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-2 h-2 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    getStatusColor('Cancelado'),
                                                            }}
                                                        ></div>
                                                        <span
                                                            style={{
                                                                color: getStatusColor('Cancelado'),
                                                            }}
                                                        >
                                                            Cancelado
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="pacienteId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full">
                                        <FormLabel>Paciente</FormLabel>
                                        <Select
                                            disabled
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            defaultValue={agendamento?.pacienteId?.toString()}
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
                                            disabled
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            defaultValue={agendamento?.medicoId?.toString()}
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
                        </div>
                        <div className="mt-6">
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

                    <div className="flex justify-between pb-5">
                        <Button variant="outline" className="px-6" onClick={() => router.back()}>
                            <ChevronLeft />
                            Voltar
                        </Button>
                        <Button
                            className="px-6"
                            onClick={() => {
                                router.push(`/agendamentos/editar/${id}`);
                            }}
                        >
                            <Pencil />
                            Editar
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
