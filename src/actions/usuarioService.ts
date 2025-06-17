'use server';
import { prisma } from '@/prisma';
import { UsuarioForm } from '@/types/usuario';
import bcrypt from 'bcryptjs';

export async function findUser(email: string) {
    const user = await prisma.usuario.findUnique({
        where: {
            email: email,
        },
    });

    return user;
}

export async function createUsuario(data: UsuarioForm) {
    const hashed = await bcrypt.hash(data.senha, 3);
    return await prisma.usuario.create({
        data: {
            nome: data.nome,
            email: data.email,
            senha: hashed,
        },
    });
}

export async function getUsuarios() {
    return await prisma.usuario.findMany({});
}

export async function getUsuarioById(id: number) {
    return await prisma.usuario.findUnique({
        where: { id },
    });
}

export async function updateUsuario(id: number, data: Partial<UsuarioForm>) {
    const usuarioExiste = await prisma.usuario.findUnique({
        where: { id },
    });

    if (!usuarioExiste) {
        return null;
    }

    let senha;

    if (data.senha) {
        const hashed = await bcrypt.hash(data.senha, 3);
        senha = hashed;
    }

    return await prisma.usuario.update({
        where: { id },
        data: {
            nome: data.nome,
            email: data.email,
            senha,
        },
    });
}

export async function deleteUsuario(id: number) {
    const usuarioExiste = await prisma.usuario.findUnique({
        where: { id },
    });

    if (!usuarioExiste) {
        return null;
    }

    return await prisma.usuario.delete({ where: { id } });
}
