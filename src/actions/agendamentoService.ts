'use server';
import { prisma } from '@/prisma';
import { AgendamentoForm } from '@/types/agendamento';

export async function createAgendamento(data: AgendamentoForm) {
    return await prisma.agendamento.create({ data });
}

export async function getAgendamentos() {
    return await prisma.agendamento.findMany({
        include: {
            paciente: true,
            medico: true,
        },
    });
}

export async function getAgendamentoById(id: number) {
    return await prisma.agendamento.findUnique({
        where: { id },
        include: {
            paciente: true,
            medico: true,
        },
    });
}

export async function updateAgendamento(id: number, data: AgendamentoForm) {
    return await prisma.agendamento.update({
        where: { id },
        data,
    });
}

export async function deleteAgendamento(id: number) {
    return await prisma.agendamento.delete({ where: { id } });
}
