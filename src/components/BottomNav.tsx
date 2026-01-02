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
      "bg-card/95 backdrop-blur-xl border-t border-border/30",
      "max-w-md mx-auto",
      isOwner && "owner-theme"
    )}>
      <div className="flex items-center justify-around py-2 px-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex flex-col items-center gap-0.5 py-2 px-3 rounded-2xl transition-all duration-300",
                "min-w-[60px]",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="navBg"
                  className="absolute inset-0 bg-primary/10 rounded-2xl"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <Icon className={cn(
                "relative w-5 h-5 transition-all duration-200",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "relative text-[10px] font-medium transition-all",
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