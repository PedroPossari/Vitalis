import z from 'zod';

export const loginSchema = z.object({
    email: z.string({ required_error: 'email é obrigatório' }).email(),
    senha: z.string({ required_error: 'senha é obrigatório' }),
});

export type LoginForm = z.infer<typeof loginSchema>;
