'use client';
import { getUsuarioById, updateUsuario } from '@/actions/usuarioService';
import { UsuarioForm, usuarioSchema } from '@/types/usuario';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWR, { mutate } from 'swr';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { AlertTriangle, ChevronLeft, LoaderCircle, Save } from 'lucide-react';

export default function Page() {
    const { id } = useParams();

    const { data, error, isLoading } = useSWR(['/usuarios', id], ([_url, id]) =>
        getUsuarioById(Number(id)),
    );

    const router = useRouter();
    const [isSubmitting, setSubmitting] = useState(false);
    async function onSubmit(data: Partial<UsuarioForm>) {
        setSubmitting(true);
        try {
            const res = await updateUsuario(Number(id), data);
            if (res) {
                mutate('/usuarios');
                toast.success('Usuário atualizado com sucesso!');
            } else {
                toast.error('Erro ao atualizar usuário!');
            }
        } catch {
            toast.error('Erro ao atualizar usuário!');
        }
        setSubmitting(false);
    }

    const form = useForm<UsuarioForm>({
        resolver: zodResolver(usuarioSchema),
        defaultValues: {
            nome: '',
            email: '',
            senha: '',
        },
        values: {
            nome: data?.nome ?? '',
            email: data?.email ?? '',
            senha: '',
        },
    });

    if (isLoading) {
        return <LoaderCircle className="animate-spin" />;
    }

    if (error || !data) {
        return (
            <div className="flex w-full h-full items-center justify-center">
                <AlertTriangle color="red" />
                <p>Erro ao buscar usuário!</p>
            </div>
        );
    }

    return (
        <div className="container bg-background h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Editar Usuário</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Informações Pessoais */}
                    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
                        <div className="md:col-span-2">
                            <div className="border-b border-border pb-2 mb-6">
                                <h2 className="text-xl font-bold text-card-foreground">
                                    Informações de Login
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
                                name="senha"
                                label="Senha"
                                type="password"
                                placeholder="Digite sua senha"
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
