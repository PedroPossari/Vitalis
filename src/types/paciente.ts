import z from 'zod';

export const pacienteSchema = z.object({
    nome: z.string({ required_error: 'nome é obrigatório' }),
    email: z.string({ required_error: 'email é obrigatório' }).email({ message: 'email inválido' }),
    telefone: z.string({ required_error: 'telefone é obrigatório' }),
    dataNascimento: z.date({ required_error: 'data de nascimento é obrigatório' }),
    genero: z.string({ required_error: 'genero é obrigatório' }),
    endereco: z.string({ required_error: 'endereço é obrigatório' }),
    contatoEmergencia: z.string(),
    telefoneEmergencia: z.string(),
    planoSaude: z.string(),
    cartaoPlano: z.string(),
    alergias: z.string(),
    medicacoesContinuas: z.string(),
    historicoMedico: z.string(),
    historicoFamiliar: z.string(),
});

export type PacienteForm = z.infer<typeof pacienteSchema>;
