import React from 'react';
import { cn } from '@/lib/utils';
import { Droplets } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  isOwner?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true,
  className,
  isOwner = false
}) => {
  const sizes = {
    sm: { icon: 'w-6 h-6', container: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-8 h-8', container: 'w-12 h-12', text: 'text-xl' },
    lg: { icon: 'w-10 h-10', container: 'w-16 h-16', text: 'text-2xl' },
    xl: { icon: 'w-14 h-14', container: 'w-20 h-20', text: 'text-3xl' },
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn(
        "relative rounded-2xl flex items-center justify-center",
        isOwner ? "bg-[var(--owner-gradient)]" : "gradient-brand",
        "shadow-primary",
        sizes[size].container
      )}>
        <Droplets className={cn(
          "text-primary-foreground drop-shadow-sm",
          sizes[size].icon
        )} />
        <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold tracking-tight",
            sizes[size].text,
            "text-foreground"
          )}>
            Milk<span className="text-gradient">Mate</span>
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-muted-foreground -mt-1">
              Fresh milk, delivered daily
            </span>
          )}
        </div>
      )}
    </div>
  );
};