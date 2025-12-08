'use client';

import * as React from 'react';
import {
  Bot,
  Building2,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  Receipt,
  Users,
} from 'lucide-react';

import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { SidebarBranding } from './sidebar-branding';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/zustand/stores/auth-store';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  // Determine user role - check if user has 'landlord' in roles array
  const isLandlord = user?.roles?.includes('landlord') ?? false;
  const isTenant = user?.roles?.includes('tenant') ?? false;

  // Default to tenant if no role is set
  const role = isLandlord ? 'landlord' : 'tenant';

  const tenantNav = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'My Agreement',
      url: '/my-agreement',
      icon: FileText,
    },
    {
      title: 'AI Assistant (Ask AI)',
      url: '/ai-assistant',
      icon: Bot,
    },
    {
      title: 'Payments',
      url: '/payments',
      icon: Receipt,
    },
    {
      title: 'Documents',
      url: '/documents',
      icon: FileText,
    },
    {
      title: 'Inspections',
      url: '/inspections',
      icon: ClipboardList,
    },
  ];

  const landlordNav = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Properties',
      url: '/properties',
      icon: Building2,
      items: [
        {
          title: 'My Properties',
          url: '/properties',
        },
        {
          title: 'Add New Property',
          url: '/properties/new',
        },
      ],
    },
    {
      title: 'Agreements',
      url: '/agreements',
      icon: ClipboardList,
      items: [
        {
          title: 'My Agreements',
          url: '/agreements',
        },
        {
          title: 'Create New Agreement',
          url: '/agreements/new',
        },
      ],
    },
    {
      title: 'Payments',
      url: '/payments',
      icon: Receipt,
    },
    {
      title: 'Tenants',
      url: '/tenants',
      icon: Users,
    },
    {
      title: 'Inspections',
      url: '/inspections',
      icon: ClipboardList,
    },
  ];

  const data = {
    teams: [
      {
        name: 'RentFit',
        logo: '/favicon.ico',
        plan: 'Pro',
      },
    ],
    navMain: role === 'landlord' ? landlordNav : tenantNav,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarBranding
          name={data.teams[0].name}
          logo={data.teams[0].logo}
          plan={data.teams[0].plan}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
