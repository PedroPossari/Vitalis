
import FormLogin from '@/components/login-form';
import Image from 'next/image';

export default function Home() {
    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container my-auto">
                <div className="mx-auto flex size-full flex-col py-10 max-w-[496px]">
                    <Image
                        src="/assets/icons/logo-full.svg"
                        height={1000}
                        width={1000}
                        alt="logo"
                        className="mb-12 h-10 w-fit"
                    />
                    <FormLogin />
                    <div className="text-14-regular mt-20 flex justify-between">
                        <p className="justify-items-end text-dark-600">© 2025 Vitalis</p>
                    </div>
                </div>
            </section>
            <Image
                src="/assets/images/onboarding-img.png"
                height={1000}
                width={1000}
                alt="paciente"
                className="side-img max-w-[50%]"
                priority
            />
            
        </div>
    );
}
