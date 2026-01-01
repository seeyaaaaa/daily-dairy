import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { Users, Droplets, IndianRupee, Check, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { customers, milkProducts } = useApp();
  const [deliveredIds, setDeliveredIds] = useState<string[]>([]);

  const today = new Date();
  const totalCustomers = customers.length;
  const totalLiters = customers.reduce((sum, c) => sum + (c.subscription?.quantityPerDelivery || 0), 0);
  const expectedCollection = customers.reduce((sum, c) => {
    const milk = milkProducts.find(m => m.id === c.subscription?.milkProductId);
    return sum + (c.subscription?.quantityPerDelivery || 0) * (milk?.pricePerLiter || 0);
  }, 0);

  const handleMarkDelivered = (customerId: string) => {
    setDeliveredIds(prev => [...prev, customerId]);
    toast.success('Marked as delivered');
  };

  return (
    <MobileLayout isOwner>
      <div className="px-5 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-muted-foreground">
            {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-2xl font-bold text-foreground">Today's Overview</h1>
        </motion.div>
      </div>

      <div className="px-5 space-y-5 pb-24">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="fresh" className="p-3 text-center">
            <Users className="w-6 h-6 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{totalCustomers}</p>
            <p className="text-xs text-muted-foreground">Customers</p>
          </Card>
          <Card variant="fresh" className="p-3 text-center">
            <Droplets className="w-6 h-6 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{totalLiters}L</p>
            <p className="text-xs text-muted-foreground">Total Milk</p>
          </Card>
          <Card variant="fresh" className="p-3 text-center">
            <IndianRupee className="w-6 h-6 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">₹{expectedCollection}</p>
            <p className="text-xs text-muted-foreground">Expected</p>
          </Card>
        </div>

        {/* Delivery List */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Today's Deliveries
          </h2>
          <div className="space-y-3">
            {customers.map((customer, index) => {
              const milk = milkProducts.find(m => m.id === customer.subscription?.milkProductId);
              const isDelivered = deliveredIds.includes(customer.id);
              const amount = (customer.subscription?.quantityPerDelivery || 0) * (milk?.pricePerLiter || 0);

              return (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card variant={isDelivered ? 'default' : 'interactive'} className={isDelivered ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{customer.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> A-{101 + index}, Sunrise Towers
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">{customer.subscription?.quantityPerDelivery}L</p>
                          <p className="text-xs text-muted-foreground">{milk?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-primary">₹{amount}</p>
                        {isDelivered ? (
                          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                            <Check className="w-3 h-3" /> Delivered
                          </span>
                        ) : (
                          <Button variant="fresh" size="sm" onClick={() => handleMarkDelivered(customer.id)}>
                            <Check className="w-4 h-4 mr-1" /> Mark Delivered
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>

      <BottomNav />
    </MobileLayout>
  );
};
