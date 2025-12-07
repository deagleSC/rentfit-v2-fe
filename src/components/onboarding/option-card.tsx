'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface OptionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  onClick: () => void;
  selected?: boolean;
  className?: string;
}

export function OptionCard({
  title,
  description,
  icon,
  onClick,
  selected = false,
  className,
}: OptionCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        selected && 'ring-2 ring-primary',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{title}</h3>
          {description && <p className="text-muted-foreground text-xs mt-1">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
