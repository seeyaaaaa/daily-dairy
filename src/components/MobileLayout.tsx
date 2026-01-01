import React from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  showNav?: boolean;
  header?: React.ReactNode;
  isOwner?: boolean;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  className,
  header,
  isOwner = false
}) => {
  return (
    <div className={cn(
      "min-h-screen w-full max-w-md mx-auto relative",
      isOwner && "owner-theme",
      className
    )}>
      {header && (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
          {header}
        </header>
      )}
      <main className="pb-24">
        {children}
      </main>
    </div>
  );
};
