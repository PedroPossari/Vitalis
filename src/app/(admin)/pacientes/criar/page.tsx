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
import FormInput from '@/components/ui/form-input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, Plus } from 'lucide-react';
import { PacienteForm, pacienteSchema } from '@/types/paciente';
import { createPaciente } from '@/actions/pacienteService';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { DateTimePicker } from '@/components/ui/datetime-picker';

export default function Page() {
    const router = useRouter();

    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const form = useForm<PacienteForm>({
        resolver: zodResolver(pacienteSchema),
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
    });

    async function onSubmit(data: PacienteForm) {
        setSubmitting(true);
        try {
            const res = await createPaciente(data);
            if (res) {
                mutate('/pacientes');
                router.replace('/pacientes');
                toast.success('Paciente cadastrado com sucesso!');
            } else {
                toast.error('Erro ao cadastrar paciente!');
            }
        } catch {
            toast.error('Erro ao criar paciente!');
        }
        setSubmitting(false);
    }

    return (
        <div className="container bg-background h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Cadastro de Paciente</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione um gênero" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Masculino">Masculino</SelectItem>
                                                <SelectItem value="Feminino">Feminino</SelectItem>
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
                            {isSubmitting ? 'Enviando...' : 'Cadastrar Paciente'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
