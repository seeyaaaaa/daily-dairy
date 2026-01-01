import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { useApp, DailyOverride } from '@/contexts/AppContext';
import { ArrowLeft, Pause, Play, Minus, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

export const TodayOverridePage: React.FC = () => {
  const navigate = useNavigate();
  const { subscriptions, milkProducts, dailyOverrides, addDailyOverride } = useApp();
  
  const activeSubscription = subscriptions[0];
  const activeMilk = activeSubscription 
    ? milkProducts.find(m => m.id === activeSubscription.milkProductId)
    : null;

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const existingOverride = activeSubscription 
    ? dailyOverrides.find(o => o.subscriptionId === activeSubscription.id && o.date === todayStr)
    : null;

  const [quantity, setQuantity] = useState(
    existingOverride?.quantityOverride ?? activeSubscription?.quantityPerDelivery ?? 1
  );
  const [isPaused, setIsPaused] = useState(existingOverride?.isPaused ?? false);

  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(0.5, Math.min(5, quantity + delta));
    setQuantity(newQty);
    if (isPaused) setIsPaused(false);
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handleSave = () => {
    if (!activeSubscription) {
      toast.error('No active subscription found');
      return;
    }

    const override: DailyOverride = {
      id: 'override-' + Date.now(),
      subscriptionId: activeSubscription.id,
      date: todayStr,
      quantityOverride: isPaused ? 0 : quantity,
      isPaused,
    };

    addDailyOverride(override);
    toast.success(isPaused ? 'Today\'s delivery paused' : `Updated to ${quantity}L for today`);
    navigate('/consumer');
  };

  if (!activeSubscription) {
    return (
      <MobileLayout
        header={
          <div className="flex items-center gap-3 px-5 py-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-accent rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Change Today's Order</h1>
          </div>
        }
      >
        <div className="px-5 py-8 text-center">
          <p className="text-muted-foreground">No active subscription found.</p>
          <Button variant="fresh" className="mt-4" onClick={() => navigate('/consumer/subscription')}>
            Start a Plan
          </Button>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout
      header={
        <div className="flex items-center gap-3 px-5 py-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-accent rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Change Today's Order</h1>
        </div>
      }
    >
      <div className="px-5 py-6 space-y-6 pb-32">
        {/* Date Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">Modifying order for</p>
          <h2 className="text-xl font-bold text-foreground">
            {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
        </motion.div>

        {/* Current Plan Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="default">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeMilk?.icon}</span>
                <div>
                  <p className="text-sm text-muted-foreground">Your regular order:</p>
                  <p className="font-semibold text-foreground">
                    {activeSubscription.quantityPerDelivery}L {activeMilk?.name} daily
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pause Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            variant={isPaused ? 'highlight' : 'interactive'} 
            className="p-0 cursor-pointer"
            onClick={handlePauseToggle}
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPaused ? 'bg-destructive/10' : 'bg-accent'}`}>
                  {isPaused ? <Pause className="w-6 h-6 text-destructive" /> : <Play className="w-6 h-6 text-primary" />}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {isPaused ? 'Delivery Paused' : 'Pause Today\'s Delivery'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isPaused ? 'Tap to resume delivery' : 'Skip milk for today'}
                  </p>
                </div>
              </div>
              {isPaused && (
                <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center">
                  <Check className="w-5 h-5 text-destructive-foreground" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quantity Adjuster */}
        {!isPaused && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Or Adjust Quantity
            </p>
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => handleQuantityChange(-0.5)}
                    disabled={quantity <= 0.5}
                    className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                  >
                    <Minus className="w-6 h-6" />
                  </button>
                  <div className="text-center min-w-[100px]">
                    <p className="text-5xl font-bold text-foreground">{quantity}</p>
                    <p className="text-muted-foreground">Liters</p>
                  </div>
                  <button
                    onClick={() => handleQuantityChange(0.5)}
                    disabled={quantity >= 5}
                    className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>

                {quantity !== activeSubscription.quantityPerDelivery && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center mt-4 text-sm text-primary font-medium"
                  >
                    {quantity > activeSubscription.quantityPerDelivery 
                      ? `+${(quantity - activeSubscription.quantityPerDelivery).toFixed(1)}L extra` 
                      : `${(quantity - activeSubscription.quantityPerDelivery).toFixed(1)}L less`
                    } than usual
                  </motion.p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="fresh">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground mb-1">For today, you will receive:</p>
              <p className="text-xl font-bold text-foreground">
                {isPaused ? (
                  <span className="text-destructive">No delivery (paused)</span>
                ) : (
                  <>
                    {quantity}L {activeMilk?.name}
                    <span className="text-muted-foreground font-normal text-base ml-2">
                      (₹{(quantity * (activeMilk?.pricePerLiter || 0)).toFixed(0)})
                    </span>
                  </>
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/95 backdrop-blur-lg border-t border-border max-w-md mx-auto">
        <div className="flex gap-3">
          <Button variant="outline" size="lg" className="flex-1" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="fresh" size="lg" className="flex-1" onClick={handleSave}>
            Confirm Changes
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};
