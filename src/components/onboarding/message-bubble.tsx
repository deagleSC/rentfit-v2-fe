'use client';

import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import type { ReactNode } from 'react';

interface MessageBubbleProps {
  type: 'bot' | 'user';
  content: string;
  className?: string;
  children?: ReactNode;
}

export function MessageBubble({ type, content, className, children }: MessageBubbleProps) {
  const isBot = type === 'bot';

  return (
    <div className={cn('flex gap-3', isBot ? 'justify-start' : 'justify-end', className)}>
      {isBot && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isBot ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground',
          children && 'space-y-3'
        )}
      >
        {content && <p className="text-sm leading-relaxed">{content}</p>}
        {children && <div className="mt-3">{children}</div>}
      </div>
      {!isBot && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
