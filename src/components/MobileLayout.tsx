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
      "bg-background",
      isOwner && "owner-theme",
      className
    )}>
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden max-w-md mx-auto">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </div>
      
      {header && (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
          {header}
        </header>
      )}
      <main className="relative pb-24">
        {children}
      </main>
    </div>
  );
};