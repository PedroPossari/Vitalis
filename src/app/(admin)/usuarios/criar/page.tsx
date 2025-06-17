'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import { UsuarioForm, usuarioSchema } from '@/types/usuario';
import { createUsuario } from '@/actions/usuarioService';
import { Form } from '@/components/ui/form';
import { ChevronLeft, Plus } from 'lucide-react';

export default function Page() {
    const router = useRouter();

    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const form = useForm<UsuarioForm>({
        resolver: zodResolver(usuarioSchema),
        defaultValues: {
            nome: '',
            email: '',
            senha: '',
        },
    });

    async function onSubmit(data: UsuarioForm) {
        setSubmitting(true);
        try {
            const res = await createUsuario(data);
            if (res) {
                mutate('/usuarios');
                router.replace('/usuarios');
                toast.success('Usuário cadastrado com sucesso!');
            } else {
                toast.error('Erro ao cadastrar usuário!');
            }
        } catch {
            toast.error('Erro ao criar usuário!');
        }
        setSubmitting(false);
    }

    return (
        <div className="container bg-background h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Cadastro de Usuário</h1>
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
                            <Plus />
                            {isSubmitting ? 'Enviando...' : 'Cadastrar Usuário'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
