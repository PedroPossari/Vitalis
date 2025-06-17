'use server';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function login(formData: { email: string; senha: string }) {
    try {
        await signIn('credentials', { ...formData, redirectTo: '/' });
    } catch (error) {
        if(error instanceof AuthError){
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: error.message }
                default:
                    return { error: 'Erro interno' }
            }
        }
        throw error;
    }
    
}

export async function logout() {
    await signOut();
}
