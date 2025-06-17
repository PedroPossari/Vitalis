'use server';
import { prisma } from '@/prisma';
import { MedicoForm } from '@/types/medico';

export async function createMedico(data: MedicoForm) {
    return await prisma.medico.create({
        data,
    });
}

export async function getMedicos() {
    return await prisma.medico.findMany({
        orderBy: { nome: 'asc' },
    });
}

export async function getMedicoById(id: number) {
    return await prisma.medico.findUnique({
        where: { id },
    });
}

export async function updateMedico(id: number, data: MedicoForm) {
    const medicoExiste = await prisma.medico.findUnique({
        where: { id },
    });

    if (!medicoExiste) {
        return null;
    }

    return await prisma.medico.update({
        where: { id },
        data,
    });
}

export async function deleteMedico(id: number) {
    const medicoExiste = await prisma.medico.findUnique({
        where: { id },
    });

    if (!medicoExiste) {
        return null;
    }

    return await prisma.medico.delete({ where: { id } });
}
