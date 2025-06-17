import NextAuth, { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { findUser } from './actions/usuarioService';
import { loginSchema } from './types/login';

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        maxAge: 7200,
    },
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: {},
                senha: {},
            },
            authorize: async (credentials) => {
                if (!credentials) throw new CredentialsSignin('Credenciais inválidas');

                const { email, senha } = loginSchema.parse(credentials);

                const usuario = await findUser(email);

                if (!usuario) throw new CredentialsSignin('Credenciais inválidas');

                if (!(await bcrypt.compare(senha, usuario.senha)))
                    throw new CredentialsSignin('Credenciais inválidas');

                return {
                    id: usuario.id.toString(),
                    email: usuario.email,
                    name: usuario.nome,
                };
            },
        }),
    ],
});
