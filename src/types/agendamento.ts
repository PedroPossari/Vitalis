import z from 'zod';

export const agendamentoSchema = z.object({
    dataHora: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date({ required_error: 'Data e hora são obrigatórias' }),
    ),
    observacoes: z.string().optional(),
    status: z.string({ required_error: 'Status é obrigatório' }),
    pacienteId: z.number({ required_error: 'Paciente é obrigatório' }),
    medicoId: z.number({ required_error: 'Médico é obrigatório' }),
});

export type AgendamentoForm = z.infer<typeof agendamentoSchema>;
