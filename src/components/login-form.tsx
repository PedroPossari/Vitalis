'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { login } from '@/actions/authService';
import { LoginForm, loginSchema } from '@/types/login';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import FormInput from './ui/form-input';
import { TbMail } from 'react-icons/tb';

export default function FormLogin() {
    const [opened, setOpen] = useState(false);

    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            senha: '',
        },
    });

    async function onSubmit(data: LoginForm) {
        const res = await login(data);
        if (res?.error) {
            setOpen(true);
        }
    }

    return (
        <Form {...form}>
            <AlertDialog open={opened}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Login inválido</AlertDialogTitle>
                        <AlertDialogDescription>
                            Email ou senha digitados estão incorretos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setOpen(false)}>Ok</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Bem-vindo de volta!</h1>
                    <p className="text-dark-700">Faça login para fazer um agendamento</p>
                </section>

                <FormInput
                    name="email"
                    placeholder="a@email.com"
                    type="email"
                    label="Email:"
                    control={form.control}
                    Icon={TbMail}
                />
                <FormInput
                    name="senha"
                    placeholder="*****"
                    type="password"
                    label="Senha:"
                    control={form.control}
                />

                <Button type="submit" variant="default">
                    Entrar
                </Button>
            </form>
        </Form>
    );
}
