'use server';
import { prisma } from '@/prisma';
import { PacienteForm } from '@/types/paciente';

export async function createPaciente(data: PacienteForm) {
    return await prisma.paciente.create({
        data,
    });
}

export async function getPacientes() {
    return await prisma.paciente.findMany();
}

export async function getPacienteById(id: number) {
    return await prisma.paciente.findUnique({
        where: { id },
    });
}

export async function updatePaciente(id: number, data: PacienteForm) {
    const pacienteExiste = await prisma.paciente.findUnique({
        where: { id },
    });

    if (!pacienteExiste) {
        return null;
    }

    return await prisma.paciente.update({
        where: { id },
        data,
    });
}

export async function deletePaciente(id: number) {
    return await prisma.paciente.delete({
        where: { id },
    });
}
