'use client';

import { usePathname } from 'next/navigation';
import {
    UserRoundPlus,
    BriefcaseMedicalIcon,
    SquareUser,
    Calendar,
    Gauge,
    ChevronRight,
    LucideIcon,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

type Item = {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
        title: string;
        url: string;
    }[];
};

const items: Item[] = [
    {
        title: 'Dashboard',
        url: '/',
        icon: Gauge,
    },
    {
        title: 'Pacientes',
        url: '/pacientes',
        icon: UserRoundPlus,
    },
    {
        title: 'Médicos',
        url: '/medicos',
        icon: BriefcaseMedicalIcon,
    },
    {
        title: 'Agendamentos',
        url: '/agendamentos',
        icon: Calendar,
    },
    {
        title: 'Usuários',
        url: '/usuarios',
        icon: SquareUser,
    },
];

export function NavMain() {
    const pathname = usePathname();
    const isActive = (href: string) => href == `/${pathname.split('/')[1]}`;

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) =>
                    item.items ? (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title}>
                                        {item.icon && <item.icon />}
                                        {item.title}
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    className={
                                                        isActive(subItem.url) ? 'bg-primary' : ''
                                                    }
                                                >
                                                    <Link href={subItem.url}>{subItem.title}</Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                className={isActive(item.url) ? 'bg-primary' : ''}
                            >
                                <Link href={item.url}>
                                    {item.icon && <item.icon />}
                                    {item.title}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
