import * as React from 'react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { auth } from '@/auth';

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const session = await auth();
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="flex justify-center items-center">
                <Image
                    src="/assets/icons/logo-full.svg"
                    alt="logo"
                    width={300}
                    height={300}
                    priority
                    className="w-[50%] mt-2 group-data-[collapsible=icon]:hidden"
                />
                <Image
                    src="/assets/icons/logo-icon.svg"
                    alt="logo"
                    width={150}
                    height={150}
                    className="w-4 hidden group-data-[collapsible=icon]:block"
                />
            </SidebarHeader>
            <SidebarContent>
                <NavMain />
            </SidebarContent>
            <SidebarFooter>
                <NavUser usuario={session?.user ?? {}} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
