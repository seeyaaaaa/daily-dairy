import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { 
  Users, Droplets, IndianRupee, Check, MapPin, 
  ArrowRight, Clock, Truck, AlertCircle, Phone
} from 'lucide-react';
import { toast } from 'sonner';

export const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { customers, milkProducts } = useApp();
  const [deliveredIds, setDeliveredIds] = useState<string[]>([]);

  const today = new Date();
  const currentHour = today.getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';
  
  const totalCustomers = customers.length;
  const totalLiters = customers.reduce((sum, c) => sum + (c.subscription?.quantityPerDelivery || 0), 0);
  const expectedCollection = customers.reduce((sum, c) => {
    const milk = milkProducts.find(m => m.id === c.subscription?.milkProductId);
    return sum + (c.subscription?.quantityPerDelivery || 0) * (milk?.pricePerLiter || 0);
  }, 0);

  const pendingDeliveries = customers.filter(c => !deliveredIds.includes(c.id)).length;
  const completedDeliveries = deliveredIds.length;
  const progressPercent = totalCustomers > 0 ? Math.round((completedDeliveries / totalCustomers) * 100) : 0;

  const handleMarkDelivered = (customerId: string) => {
    setDeliveredIds(prev => [...prev, customerId]);
    toast.success('Marked as delivered');
  };

  // Get next 3 pending deliveries
  const upcomingDeliveries = customers
    .filter(c => !deliveredIds.includes(c.id))
    .slice(0, 3);

  return (
    <MobileLayout isOwner>
      <div className="px-5 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-muted-foreground">
            {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-2xl font-bold text-foreground">{greeting}! 👋</h1>
        </motion.div>
      </div>

      <div className="px-5 space-y-5 pb-24">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="fresh" className="p-3 text-center cursor-pointer" onClick={() => navigate('/owner/customers')}>
              <Users className="w-6 h-6 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold">{totalCustomers}</p>
              <p className="text-xs text-muted-foreground">Customers</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card variant="fresh" className="p-3 text-center cursor-pointer" onClick={() => navigate('/owner/deliveries')}>
              <Droplets className="w-6 h-6 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold">{totalLiters}L</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="fresh" className="p-3 text-center cursor-pointer" onClick={() => navigate('/owner/bills')}>
              <IndianRupee className="w-6 h-6 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold">₹{expectedCollection}</p>
              <p className="text-xs text-muted-foreground">Expected</p>
            </Card>
          </motion.div>
        </div>

        {/* Today's Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card variant="fresh" className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Today's Progress</span>
                </div>
                <span className="text-sm font-medium text-primary">{progressPercent}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden mb-3">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  <Check className="w-4 h-4 inline mr-1 text-emerald-500" />
                  {completedDeliveries} completed
                </span>
                <span className="text-muted-foreground">
                  <Clock className="w-4 h-4 inline mr-1 text-amber-500" />
                  {pendingDeliveries} pending
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => navigate('/owner/deliveries')}
          >
            <Truck className="w-6 h-6 text-primary" />
            <span>Start Deliveries</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={() => navigate('/owner/bills')}
          >
            <IndianRupee className="w-6 h-6 text-primary" />
            <span>Collect Payments</span>
          </Button>
        </div>

        {/* Upcoming Deliveries Preview */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Next Deliveries
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary"
              onClick={() => navigate('/owner/deliveries')}
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {upcomingDeliveries.map((customer, index) => {
              const milk = milkProducts.find(m => m.id === customer.subscription?.milkProductId);
              const amount = (customer.subscription?.quantityPerDelivery || 0) * (milk?.pricePerLiter || 0);

              return (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Card variant="interactive">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{customer.name}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> A-{101 + index}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-bold text-foreground">{customer.subscription?.quantityPerDelivery}L</p>
                            <p className="text-xs text-primary">₹{amount}</p>
                          </div>
                          <Button 
                            variant="fresh" 
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => handleMarkDelivered(customer.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {upcomingDeliveries.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="font-semibold text-foreground">All Done!</p>
                <p className="text-sm text-muted-foreground">All deliveries completed for today</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Alerts/Reminders */}
        {pendingDeliveries > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Pending Deliveries</p>
                  <p className="text-sm text-amber-600">
                    {pendingDeliveries} customers waiting for delivery today
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </MobileLayout>
  );
};
