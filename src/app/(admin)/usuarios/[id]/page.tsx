'use client';
import { getUsuarioById } from '@/actions/usuarioService';
import { UsuarioForm } from '@/types/usuario';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { Form } from '@/components/ui/form';

import { AlertTriangle, ChevronLeft, LoaderCircle, Pencil } from 'lucide-react';

export default function Page() {
    const { id } = useParams();

    const { data, error, isLoading } = useSWR(['/usuarios', id], ([_url, id]) =>
        getUsuarioById(Number(id)),
    );

    const router = useRouter();

    const form = useForm<UsuarioForm>({
        disabled: true,
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
                <h1 className="text-2xl font-bold text-foreground">Visualizar Usuário</h1>
            </div>

            <Form {...form}>
                <form className="space-y-8">
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
                        <Button variant="outline" className="px-6" onClick={() => router.back()}>
                            <ChevronLeft />
                            Voltar
                        </Button>
                        <Button
                            className="px-6"
                            onClick={() => router.push(`/usuarios/editar/${id}`)}
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
