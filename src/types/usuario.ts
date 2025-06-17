import z from 'zod';

export const usuarioSchema = z.object({
    nome: z.string({ required_error: 'nome é obrigatório' }),
    email: z.string({ required_error: 'email é obrigatório' }).email(),
    senha: z.string({ required_error: 'senha é obrigatório' }),
});

export type UsuarioForm = z.infer<typeof usuarioSchema>;
