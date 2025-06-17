'use client';
import { getMedicoById, updateMedico } from '@/actions/medicoService';
import { AlertTriangle, LoaderCircle, Save } from 'lucide-react';
import { useParams } from 'next/navigation';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { MedicoForm, medicoSchema } from '@/types/medico';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';

export default function Page() {
    const { id } = useParams();

    const { data, error, isLoading } = useSWR(['/medicos', id], ([_url, id]) =>
        getMedicoById(Number(id)),
    );

    const router = useRouter();
    const [isSubmitting, setSubmitting] = useState(false);

    const form = useForm<MedicoForm>({
        resolver: zodResolver(medicoSchema),
        defaultValues: {
            nome: '',
            email: '',
            telefone: '',
            crm: '',
            especialidade: '',
            genero: '',
            endereco: '',
        },
        values: {
            nome: data?.nome ?? '',
            email: data?.email ?? '',
            telefone: data?.telefone ?? '',
            crm: data?.crm ?? '',
            especialidade: data?.especialidade ?? '',
            genero: data?.genero ?? '',
            endereco: data?.endereco ?? '',
        },
    });

    const especialidades = [
        'Cardiologia',
        'Dermatologia',
        'Endocrinologia',
        'Gastroenterologia',
        'Ginecologia',
        'Neurologia',
        'Oftalmologia',
        'Ortopedia',
        'Otorrinolaringologia',
        'Pediatria',
        'Pneumologia',
        'Psiquiatria',
        'Radiologia',
        'Urologia',
        'Clínica Geral',
        'Medicina de Família',
        'Anestesiologia',
        'Cirurgia Geral',
        'Medicina do Trabalho',
        'Medicina Esportiva',
    ];

    async function onSubmit(data: MedicoForm) {
        setSubmitting(true);
        try {
            const res = await updateMedico(Number(id), data);
            if (res) {
                mutate(['/medicos', id]);
                toast.success('Médico atualizado com sucesso!');
            } else {
                toast.error('Erro ao atualizar médico!');
            }
        } catch {
            toast.error('Erro ao atualizar médico!');
        }
        setSubmitting(false);
    }

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
                <h1 className="text-2xl font-bold text-foreground">Editar Médico</h1>
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
                                placeholder="Digite o nome completo do médico"
                            />

                            <FormInput
                                control={form.control}
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="email@exemplo.com"
                            />

                            <FormInput
                                control={form.control}
                                name="telefone"
                                label="Telefone"
                                placeholder="(00) 00000-0000"
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
                        </div>
                    </div>

                    {/* Informações Profissionais */}
                    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                        <div className="md:col-span-2">
                            <div className="border-b border-border pb-2 mb-6">
                                <h2 className="text-xl font-bold text-card-foreground">
                                    Informações Profissionais
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                control={form.control}
                                name="crm"
                                label="CRM"
                                placeholder="Ex: CRM/SP 123456"
                            />

                            <FormField
                                control={form.control}
                                name="especialidade"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full">
                                        <FormLabel>Especialidade</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={data?.especialidade}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione uma especialidade" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-60">
                                                {especialidades.map((especialidade) => (
                                                    <SelectItem
                                                        key={especialidade}
                                                        value={especialidade}
                                                    >
                                                        {especialidade}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormInput
                                control={form.control}
                                name="endereco"
                                label="Endereço do Consultório"
                                placeholder="Rua, número, bairro, cidade, estado, CEP"
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
                            <Save />
                            {isSubmitting ? 'Enviando...' : 'Salvar'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
