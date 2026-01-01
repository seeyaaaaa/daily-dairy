import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Receipt, User, Truck, Users, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';

const consumerNavItems = [
  { icon: Home, label: 'Home', path: '/consumer' },
  { icon: ClipboardList, label: 'Orders', path: '/consumer/orders' },
  { icon: Receipt, label: 'Bills', path: '/consumer/bills' },
  { icon: User, label: 'Account', path: '/consumer/account' },
];

const ownerNavItems = [
  { icon: Home, label: 'Today', path: '/owner' },
  { icon: Truck, label: 'Deliveries', path: '/owner/deliveries' },
  { icon: Users, label: 'Customers', path: '/owner/customers' },
  { icon: Receipt, label: 'Bills', path: '/owner/bills' },
  { icon: BarChart3, label: 'Stats', path: '/owner/stats' },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();

  const navItems = user?.role === 'owner' ? ownerNavItems : consumerNavItems;
  const isOwner = user?.role === 'owner';

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-card/95 backdrop-blur-lg border-t border-border/50",
      "max-w-md mx-auto",
      isOwner && "owner-theme"
    )}>
      <div className="flex items-center justify-around py-2 px-4 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200",
                "min-w-[64px]",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  "w-6 h-6 transition-transform duration-200",
                  isActive && "scale-110"
                )} />
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
