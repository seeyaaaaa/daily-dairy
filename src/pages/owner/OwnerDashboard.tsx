import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { Logo } from '@/components/Logo';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Users, Droplets, IndianRupee, Check, MapPin, 
  ArrowRight, Clock, Truck, AlertCircle, Navigation,
  TrendingUp, Calendar, UserPlus, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { customers, milkProducts, user } = useApp();
  const { t } = useTranslation();
  const [deliveredIds, setDeliveredIds] = useState<string[]>([]);

  const today = new Date();
  const currentHour = today.getHours();
  const greeting = currentHour < 12 ? t('good_morning') : currentHour < 17 ? t('good_afternoon') : t('good_evening');
  
  const totalCustomers = customers.length;
  const isNewOwner = user?.isNewUser && totalCustomers === 0;
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

  const upcomingDeliveries = customers
    .filter(c => !deliveredIds.includes(c.id))
    .slice(0, 3);

  return (
    <MobileLayout isOwner>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--owner-primary))]/10 to-transparent" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-[hsl(var(--owner-primary))]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative px-5 pt-6 pb-5">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <Logo size="sm" showText={false} isOwner />
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card/80 px-3 py-1.5 rounded-full border border-border/50">
                <Calendar className="w-3 h-3" />
                {today.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{greeting}</p>
            <h1 className="text-2xl font-bold text-foreground">{user?.name || 'Dairy'} 🏪</h1>
          </motion.div>
        </div>
      </div>

      <div className="px-5 space-y-5 pb-24">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users, value: totalCustomers, label: t('customers'), path: '/owner/customers', color: 'bg-blue-500' },
            { icon: Droplets, value: `${totalLiters}L`, label: t('today'), path: '/owner/deliveries', color: 'bg-emerald-500' },
            { icon: IndianRupee, value: `₹${expectedCollection}`, label: t('expected'), path: '/owner/bills', color: 'bg-amber-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card 
                variant="fresh" 
                className="p-4 text-center cursor-pointer group border-0 shadow-card hover:shadow-elevated transition-all" 
                onClick={() => navigate(stat.path)}
              >
                <div className={`w-10 h-10 mx-auto mb-2 rounded-xl ${stat.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Today's Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card variant="fresh" className="overflow-hidden border-0 shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">{t('todays_progress')}</span>
                    <p className="text-xs text-muted-foreground">{completedDeliveries} of {totalCustomers} {t('deliveries')}</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full rounded-full"
                  style={{ background: 'var(--gradient-brand)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between mt-3 text-sm">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <Check className="w-4 h-4" />
                  {completedDeliveries} {t('completed')}
                </span>
                <span className="flex items-center gap-1.5 text-amber-600">
                  <Clock className="w-4 h-4" />
                  {pendingDeliveries} {t('pending')}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions - Always show */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-auto py-5 flex flex-col items-center gap-2 border-2 hover:border-primary hover:bg-accent/50"
            onClick={() => navigate('/owner/customers')}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <span className="font-semibold">{t('add_customers')}</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto py-5 flex flex-col items-center gap-2 border-2 hover:border-primary hover:bg-accent/50"
            onClick={() => navigate('/owner/deliveries')}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Navigation className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="font-semibold">{t('start_route')}</span>
          </Button>
        </div>

        {/* Getting Started for new owners */}
        {isNewOwner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="fresh" className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{t('getting_started')}</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">1</div>
                  <p className="text-sm text-muted-foreground">Add your first customer</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">2</div>
                  <p className="text-sm text-muted-foreground">Set up their subscription plan</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">3</div>
                  <p className="text-sm text-muted-foreground">Start delivering & tracking!</p>
                </div>
              </div>
              <Button 
                variant="hero" 
                className="w-full mt-4"
                onClick={() => navigate('/owner/customers')}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {t('add_first_customer')}
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Upcoming Deliveries Preview - Only show if has customers */}
        {!isNewOwner && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                {t('next_deliveries')}
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary"
                onClick={() => navigate('/owner/deliveries')}
              >
                {t('view_all')} <ArrowRight className="w-4 h-4 ml-1" />
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
                    <Card variant="interactive" className="border-0 shadow-soft">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-lg">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{customer.name}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> A-{101 + index}, Sunshine Apt
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-bold text-foreground">{customer.subscription?.quantityPerDelivery}L</p>
                              <p className="text-xs text-primary font-medium">₹{amount}</p>
                            </div>
                            <Button 
                              variant="fresh" 
                              size="icon"
                              className="h-10 w-10 rounded-xl shadow-primary"
                              onClick={() => handleMarkDelivered(customer.id)}
                            >
                              <Check className="w-5 h-5" />
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
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-10 h-10 text-emerald-600" />
                  </div>
                  <p className="font-semibold text-foreground text-lg">{t('all_done')} 🎉</p>
                  <p className="text-sm text-muted-foreground mt-1">All deliveries completed for today</p>
                </motion.div>
              )}
            </div>
          </section>
        )}

        {/* Alerts - Only show if has pending deliveries and not new owner */}
        {!isNewOwner && pendingDeliveries > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-amber-50 border-amber-200/50 shadow-soft">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-amber-800">{t('pending_deliveries')}</p>
                  <p className="text-sm text-amber-600">
                    {pendingDeliveries} {t('customers_waiting')}
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
