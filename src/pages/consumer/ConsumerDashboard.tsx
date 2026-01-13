import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { Logo } from '@/components/Logo';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Calendar, Edit3, TrendingUp, ChevronRight, Plus, Pause, Truck, ClipboardList, Bell, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const ConsumerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, subscriptions, milkProducts, dailyOverrides } = useApp();
  const { t } = useTranslation();
  const { supported, permission, requestPermission } = usePushNotifications();
  const [notificationLoading, setNotificationLoading] = useState(false);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const activeSubscription = subscriptions[0];
  const activeMilk = activeSubscription 
    ? milkProducts.find(m => m.id === activeSubscription.milkProductId)
    : null;

  const todayOverride = activeSubscription 
    ? dailyOverrides.find(o => o.subscriptionId === activeSubscription.id && o.date === todayStr)
    : null;

  const todayQuantity = todayOverride?.isPaused 
    ? 0 
    : (todayOverride?.quantityOverride ?? activeSubscription?.quantityPerDelivery ?? 0);

  const todayTotal = todayQuantity * (activeMilk?.pricePerLiter ?? 0);

  // Only show stats if user has subscription
  const hasSubscription = !!activeSubscription;
  const monthlyLiters = hasSubscription ? 28.5 : 0;
  const monthlyBill = hasSubscription ? 1710 : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('good_morning');
    if (hour < 17) return t('good_afternoon');
    return t('good_evening');
  };

  const handleNotificationClick = async () => {
    if (!supported) {
      toast.error('Push notifications are not supported on this device');
      return;
    }
    
    if (permission === 'granted') {
      toast.success('Notifications are already enabled!');
      return;
    }
    
    setNotificationLoading(true);
    const granted = await requestPermission();
    setNotificationLoading(false);
    
    if (granted) {
      toast.success('Notifications enabled! You\'ll receive delivery updates.');
    } else {
      toast.error('Please enable notifications in your browser settings');
    }
  };

  return (
    <MobileLayout>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-soft" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative px-5 pt-6 pb-5">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-muted-foreground font-medium">{getGreeting()}</p>
              <h1 className="text-2xl font-bold text-foreground mt-0.5">
                {user?.name || t('welcome')} 👋
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleNotificationClick}
                disabled={notificationLoading}
                className={`relative w-10 h-10 rounded-full bg-card shadow-soft flex items-center justify-center border border-border/50 transition-all hover:scale-105 ${
                  notificationLoading ? 'opacity-50' : ''
                }`}
              >
                <Bell className={`w-5 h-5 ${permission === 'granted' ? 'text-primary' : 'text-muted-foreground'}`} />
                {permission !== 'granted' && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive animate-pulse" />
                )}
                {permission === 'granted' && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
              <Logo size="sm" showText={false} />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Today's Order Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated" className="overflow-hidden border-0">
            <div className="gradient-hero p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-semibold text-primary-foreground">{t('todays_delivery')}</span>
                  <p className="text-xs text-primary-foreground/70">
                    {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
              {!todayOverride?.isPaused && activeSubscription && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-foreground">{todayQuantity}L</p>
                  <p className="text-xs text-primary-foreground/70">₹{todayTotal}</p>
                </div>
              )}
            </div>
            
            <CardContent className="p-5">
              {activeSubscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-accent/50">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{activeMilk?.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{activeMilk?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{activeMilk?.pricePerLiter} per liter
                        </p>
                      </div>
                    </div>
                    {todayOverride?.isPaused && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                        <Pause className="w-3 h-3" /> Paused
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      variant="soft" 
                      className="flex-1 h-12"
                      onClick={() => navigate('/consumer/today-override')}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      {t('change_today')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12"
                      onClick={() => navigate('/consumer/subscription')}
                    >
                      {t('manage_plan')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{t('start_plan')}</h3>
                  <p className="text-muted-foreground text-sm mb-4">Get fresh milk delivered to your doorstep daily</p>
                  <Button 
                    variant="hero" 
                    onClick={() => navigate('/consumer/subscription')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('create_subscription')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* This Month Stats - Only show if has subscription */}
        {hasSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="interactive" onClick={() => navigate('/consumer/bills')} className="group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    {t('this_month')}
                  </CardTitle>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-foreground">{monthlyLiters}L</p>
                    <p className="text-sm text-muted-foreground">{t('total_delivered')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gradient">₹{monthlyBill}</p>
                    <p className="text-sm text-muted-foreground">{t('approx_bill')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions - Show Track Delivery for all, Order History only for subscribers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`grid ${hasSubscription ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}
        >
          {hasSubscription && (
            <Card 
              variant="interactive" 
              className="p-5 group"
              onClick={() => navigate('/consumer/delivery-status')}
            >
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Truck className="w-7 h-7 text-emerald-600" />
                </div>
                <p className="font-semibold text-foreground">{t('track_delivery')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('see_live_status')}</p>
              </div>
            </Card>
          )}
          {hasSubscription && (
            <Card 
              variant="interactive" 
              className="p-5 group"
              onClick={() => navigate('/consumer/orders')}
            >
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ClipboardList className="w-7 h-7 text-blue-600" />
                </div>
                <p className="font-semibold text-foreground">{t('order_history')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('past_deliveries')}</p>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Getting Started for new users */}
        {!hasSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="fresh" className="p-5">
              <h3 className="font-semibold text-foreground mb-3">{t('getting_started')}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">1</div>
                  <p className="text-sm text-muted-foreground">{t('create_first_subscription')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">2</div>
                  <p className="text-sm text-muted-foreground">{t('choose_milk_quantity')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">3</div>
                  <p className="text-sm text-muted-foreground">{t('start_receiving')}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </MobileLayout>
  );
};
