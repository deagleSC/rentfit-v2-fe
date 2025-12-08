'use client';

import * as React from 'react';
import Image from 'next/image';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { ClientOnly } from '@/components/client-only';

interface SidebarBrandingProps {
  name: string;
  logo: string;
  plan: string;
}

export function SidebarBranding({ name, logo, plan }: SidebarBrandingProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <ClientOnly
          fallback={
            <SidebarMenuButton size="lg">
              <Image src={logo} alt={name} width={36} height={36} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                <span className="truncate text-xs">{plan}</span>
              </div>
            </SidebarMenuButton>
          }
        >
          <SidebarMenuButton size="lg">
            <Image src={logo} alt={name} width={36} height={36} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-xs">{plan}</span>
            </div>
          </SidebarMenuButton>
        </ClientOnly>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
