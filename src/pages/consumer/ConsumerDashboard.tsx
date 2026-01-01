import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { Calendar, Edit3, TrendingUp, ChevronRight, Plus, Pause, Droplets } from 'lucide-react';

export const ConsumerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, subscriptions, milkProducts, addresses, dailyOverrides } = useApp();

  const today = new Date();
  const dayOfWeek = today.getDay();
  const todayStr = today.toISOString().split('T')[0];
  
  // Get active subscription
  const activeSubscription = subscriptions[0];
  const activeMilk = activeSubscription 
    ? milkProducts.find(m => m.id === activeSubscription.milkProductId)
    : null;

  // Check for today's override
  const todayOverride = activeSubscription 
    ? dailyOverrides.find(o => o.subscriptionId === activeSubscription.id && o.date === todayStr)
    : null;

  const todayQuantity = todayOverride?.isPaused 
    ? 0 
    : (todayOverride?.quantityOverride ?? activeSubscription?.quantityPerDelivery ?? 0);

  const todayTotal = todayQuantity * (activeMilk?.pricePerLiter ?? 0);

  // Mock monthly stats
  const monthlyLiters = 28.5;
  const monthlyBill = 1710;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <MobileLayout>
      {/* Header */}
      <div className="px-5 pt-6 pb-4 gradient-soft">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-muted-foreground">{getGreeting()}</p>
            <h1 className="text-2xl font-bold text-foreground">
              {user?.name || 'Welcome'} 👋
            </h1>
          </div>
          <div className="w-12 h-12 rounded-full gradient-fresh flex items-center justify-center shadow-glow">
            <Droplets className="w-6 h-6 text-primary-foreground" />
          </div>
        </motion.div>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Today's Order Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="elevated" className="overflow-hidden">
            <div className="gradient-fresh p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary-foreground" />
                <span className="font-semibold text-primary-foreground">Today's Order</span>
              </div>
              <span className="text-sm text-primary-foreground/80">
                {today.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
            
            <CardContent className="p-5">
              {activeSubscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{activeMilk?.icon}</span>
                      <div>
                        <p className="font-semibold text-foreground">{activeMilk?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{activeMilk?.pricePerLiter}/L
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {todayOverride?.isPaused ? (
                        <span className="inline-flex items-center gap-1 text-destructive font-medium">
                          <Pause className="w-4 h-4" /> Paused
                        </span>
                      ) : (
                        <>
                          <p className="text-2xl font-bold text-foreground">{todayQuantity} L</p>
                          <p className="text-sm text-muted-foreground">₹{todayTotal}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="soft" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate('/consumer/today-override')}
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Change Today
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate('/consumer/subscription')}
                    >
                      Manage Plan
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">You haven't started a milk plan yet</p>
                  <Button 
                    variant="fresh" 
                    onClick={() => navigate('/consumer/subscription')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Start Your Milk Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* This Month Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="interactive" onClick={() => navigate('/consumer/bills')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  This Month
                </CardTitle>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{monthlyLiters} L</p>
                  <p className="text-sm text-muted-foreground">Total delivered</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">₹{monthlyBill}</p>
                  <p className="text-sm text-muted-foreground">Approx. bill</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          <Card 
            variant="interactive" 
            className="p-4"
            onClick={() => navigate('/consumer/delivery-status')}
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-accent flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <p className="text-sm font-medium text-foreground">Track Delivery</p>
            </div>
          </Card>
          <Card 
            variant="interactive" 
            className="p-4"
            onClick={() => navigate('/consumer/orders')}
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-accent flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-sm font-medium text-foreground">Order History</p>
            </div>
          </Card>
        </motion.div>
      </div>

      <BottomNav />
    </MobileLayout>
  );
};
