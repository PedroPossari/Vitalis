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
import FormInput from '@/components/ui/form-input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, ChevronLeft, LoaderCircle, Pencil } from 'lucide-react';
import { PacienteForm } from '@/types/paciente';
import { useRouter } from 'next/navigation';
import { getPacienteById } from '@/actions/pacienteService';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { DateTimePicker } from '@/components/ui/datetime-picker';

export default function Page() {
    const { id } = useParams();

    const { data, error, isLoading } = useSWR(['/pacientes', id], ([_url, id]) =>
        getPacienteById(Number(id)),
    );
    const router = useRouter();

    const form = useForm<PacienteForm>({
        disabled: true,
        defaultValues: {
            nome: '',
            email: '',
            telefone: '',
            endereco: '',
            contatoEmergencia: '',
            telefoneEmergencia: '',
            planoSaude: '',
            cartaoPlano: '',
            alergias: '',
            medicacoesContinuas: '',
            historicoMedico: '',
            historicoFamiliar: '',
            genero: '',
        },
        values: {
            nome: data?.nome ?? '',
            email: data?.email ?? '',
            telefone: data?.telefone ?? '',
            endereco: data?.endereco ?? '',
            contatoEmergencia: data?.contatoEmergencia ?? '',
            telefoneEmergencia: data?.telefoneEmergencia ?? '',
            planoSaude: data?.planoSaude ?? '',
            cartaoPlano: data?.cartaoPlano ?? '',
            alergias: data?.alergias ?? '',
            medicacoesContinuas: data?.medicacoesContinuas ?? '',
            historicoMedico: data?.historicoMedico ?? '',
            historicoFamiliar: data?.historicoFamiliar ?? '',
            dataNascimento: data?.dataNascimento ?? new Date(),
            genero: data?.genero ?? '',
        },
    });

    if (isLoading) {
        return <LoaderCircle className="animate-spin" />;
    }

    if (error || !data) {
        return (
            <div className="flex w-full h-full items-center justify-center">
                <AlertTriangle color="red" />
                <p>Erro ao buscar paciente!</p>
            </div>
        );
    }

    return (
        <div className="container bg-background h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Visualizar Paciente</h1>
            </div>

            <Form {...form}>
                <form className="space-y-8">
                    {/* Informações Pessoais */}
                    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                        <div className="md:col-span-2">
                            <div className="border-b border-border pb-2 mb-6">
                                <h2 className="text-xl font-bold text-card-foreground">
                                    Informações Pessoais
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                control={form.control}
                                name="nome"
                                label="Nome Completo"
                                placeholder="Digite seu nome completo"
                            />

                            <FormInput
                                control={form.control}
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="seu@email.com"
                            />

                            <FormInput
                                control={form.control}
                                name="telefone"
                                label="Telefone"
                                placeholder="(00) 00000-0000"
                            />

                            <DateTimePicker
                                name="dataNascimento"
                                control={form.control}
                                disabled
                                label="Data de Nascimento"
                                placeholder="Selecione a data de nascimento"
                                mode="date"
                            />

                            <FormField
                                control={form.control}
                                name="genero"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full">
                                        <FormLabel>Gênero</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={data?.genero}
                                            disabled
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione um gênero" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="masculino">Masculino</SelectItem>
                                                <SelectItem value="feminino">Feminino</SelectItem>
                                                <SelectItem value="outro">Outro</SelectItem>
                                                <SelectItem value="prefiro-nao-informar">
                                                    Prefiro não informar
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormInput
                                control={form.control}
                                name="endereco"
                                label="Endereço Completo"
                                placeholder="Rua, número, bairro, cidade, estado, CEP"
                            />
                        </div>
                    </div>

                    {/* Contato de Emergência */}
                    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                        <div className="md:col-span-2">
                            <div className="border-b border-border pb-2 mb-6">
                                <h2 className="text-xl font-bold text-card-foreground">
                                    Contato de Emergência
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                control={form.control}
                                name="contatoEmergencia"
                                label="Nome do Contato"
                                placeholder="Nome do contato de emergência"
                            />

                            <FormInput
                                control={form.control}
                                name="telefoneEmergencia"
                                label="Telefone de Emergência"
                                placeholder="(00) 00000-0000"
                            />
                        </div>
                    </div>

                    {/* Plano de Saúde */}
                    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                        <div className="md:col-span-2">
                            <div className="border-b border-border pb-2 mb-6">
                                <h2 className="text-xl font-bold text-card-foreground">
                                    Plano de Saúde
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                control={form.control}
                                name="planoSaude"
                                label="Nome do Plano"
                                placeholder="Nome do plano de saúde"
                            />

                            <FormInput
                                control={form.control}
                                name="cartaoPlano"
                                label="Número do Cartão"
                                placeholder="Número do cartão do plano"
                            />
                        </div>
                    </div>

                    {/* Informações Médicas */}
                    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                        <div className="md:col-span-2">
                            <div className="border-b border-border pb-2 mb-6">
                                <h2 className="text-xl font-bold text-card-foreground">
                                    Informações Médicas
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <FormField
                                control={form.control}
                                name="alergias"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alergias</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Liste suas alergias conhecidas, como medicamentos, alimentos, etc."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="medicacoesContinuas"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Medicações Contínuas</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Liste as medicações que você toma regularmente."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="historicoMedico"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Histórico Médico</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descreva seu histórico médico, incluindo doenças crônicas, cirurgias, etc."
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="historicoFamiliar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Histórico Familiar</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descreva doenças que já ocorreram na sua família."
                                                className="resize-none"
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
                            onClick={() => router.push(`/pacientes/editar/${id}`)}
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
