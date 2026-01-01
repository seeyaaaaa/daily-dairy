import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { ArrowLeft, Package, ChevronRight } from 'lucide-react';

// Mock order history
const mockOrders = [
  { date: '2025-01-01', quantity: 1, milk: 'Cow Milk', price: 60, status: 'delivered' },
  { date: '2024-12-31', quantity: 1, milk: 'Cow Milk', price: 60, status: 'delivered' },
  { date: '2024-12-30', quantity: 0, milk: 'Cow Milk', price: 0, status: 'paused' },
  { date: '2024-12-29', quantity: 1.5, milk: 'Cow Milk', price: 90, status: 'delivered' },
  { date: '2024-12-28', quantity: 1, milk: 'Cow Milk', price: 60, status: 'delivered' },
  { date: '2024-12-27', quantity: 1, milk: 'Cow Milk', price: 60, status: 'delivered' },
  { date: '2024-12-26', quantity: 1, milk: 'Cow Milk', price: 60, status: 'delivered' },
];

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { milkProducts } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">Delivered</span>;
      case 'paused':
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">Paused</span>;
      case 'missed':
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-destructive/10 text-destructive">Missed</span>;
      default:
        return <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent text-accent-foreground">Pending</span>;
    }
  };

  return (
    <MobileLayout>
      {/* Header */}
      <div className="px-5 py-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-lg z-10">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-semibold">Order History</h1>
        </div>
      </div>

      <div className="px-5 py-4 space-y-3 pb-24">
        {mockOrders.map((order, index) => {
          const date = new Date(order.date);
          return (
            <motion.div
              key={order.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card variant="interactive" className="p-0">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-foreground leading-none">
                        {date.getDate()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {date.toLocaleDateString('en-IN', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {order.quantity > 0 ? `${order.quantity}L ${order.milk}` : 'No delivery'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {date.toLocaleDateString('en-IN', { weekday: 'long' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      {order.price > 0 && (
                        <p className="font-semibold text-foreground">₹{order.price}</p>
                      )}
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <BottomNav />
    </MobileLayout>
  );
};
