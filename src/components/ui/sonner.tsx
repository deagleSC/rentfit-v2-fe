'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-card dark:group-[.toaster]:text-card-foreground',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success:
            '!bg-green-50 !text-green-900 !border-green-200 dark:!bg-green-950/90 dark:!text-green-100 dark:!border-green-700',
          error:
            '!bg-red-50 !text-red-900 !border-red-200 dark:!bg-red-950/90 dark:!text-red-100 dark:!border-red-700',
          warning:
            '!bg-yellow-50 !text-yellow-900 !border-yellow-200 dark:!bg-yellow-950/90 dark:!text-yellow-100 dark:!border-yellow-700',
          info: '!bg-blue-50 !text-blue-900 !border-blue-200 dark:!bg-blue-950/90 dark:!text-blue-100 dark:!border-blue-700',
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
