import z from 'zod';

export const medicoSchema = z.object({
    nome: z.string({ required_error: 'nome é obrigatório' }),
    email: z.string({ required_error: 'email é obrigatório' }).email({ message: 'email inválido' }),
    telefone: z.string({ required_error: 'telefone é obrigatório' }),
    crm: z.string({ required_error: 'CRM é obrigatório' }),
    especialidade: z.string({ required_error: 'especialidade é obrigatória' }),
    genero: z.string({ required_error: 'gênero é obrigatório' }),
    endereco: z.string({ required_error: 'endereço é obrigatório' }),
});

export type MedicoForm = z.infer<typeof medicoSchema>;
