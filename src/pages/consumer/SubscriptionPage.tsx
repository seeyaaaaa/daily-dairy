import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { useApp, Subscription } from '@/contexts/AppContext';
import { ArrowLeft, Check, Calendar, Repeat } from 'lucide-react';
import { toast } from 'sonner';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const scheduleOptions = [
  { id: 'daily', label: 'Daily', days: [0, 1, 2, 3, 4, 5, 6], icon: '📅' },
  { id: 'weekdays', label: 'Weekdays Only', days: [1, 2, 3, 4, 5, 6], icon: '🏢' },
  { id: 'custom', label: 'Custom Days', days: [], icon: '✏️' },
];

const quantityOptions = [0.5, 1, 1.5, 2, 2.5, 3];

export const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { milkProducts, subscriptions, addSubscription, updateSubscription, addresses } = useApp();
  
  const existingSubscription = subscriptions[0];
  
  const [selectedMilk, setSelectedMilk] = useState(existingSubscription?.milkProductId || milkProducts[0].id);
  const [quantity, setQuantity] = useState(existingSubscription?.quantityPerDelivery || 1);
  const [scheduleType, setScheduleType] = useState<string>('daily');
  const [customDays, setCustomDays] = useState<number[]>(existingSubscription?.daysOfWeek || [0, 1, 2, 3, 4, 5, 6]);

  const selectedProduct = milkProducts.find(m => m.id === selectedMilk);
  
  const activeDays = scheduleType === 'custom' 
    ? customDays 
    : scheduleOptions.find(s => s.id === scheduleType)?.days || [];

  const monthlyEstimate = quantity * (selectedProduct?.pricePerLiter || 0) * activeDays.length * 4;

  const toggleCustomDay = (day: number) => {
    setCustomDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const handleSave = () => {
    if (activeDays.length === 0) {
      toast.error('Please select at least one delivery day');
      return;
    }

    const subscriptionData: Subscription = {
      id: existingSubscription?.id || 'sub-' + Date.now(),
      customerId: 'user-1',
      addressId: addresses[0]?.id || 'addr-1',
      milkProductId: selectedMilk,
      quantityPerDelivery: quantity,
      daysOfWeek: activeDays,
      startDate: new Date().toISOString().split('T')[0],
      isActive: true,
    };

    if (existingSubscription) {
      updateSubscription(existingSubscription.id, subscriptionData);
      toast.success('Subscription updated!');
    } else {
      addSubscription(subscriptionData);
      toast.success('Subscription started!');
    }
    navigate('/consumer');
  };

  return (
    <MobileLayout
      header={
        <div className="flex items-center gap-3 px-5 py-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-accent rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">
            {existingSubscription ? 'Manage Subscription' : 'Start Your Plan'}
          </h1>
        </div>
      }
    >
      <div className="px-5 py-4 space-y-6 pb-32">
        {/* Milk Type Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Select Milk Type
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {milkProducts.map((milk) => (
              <Card
                key={milk.id}
                variant={selectedMilk === milk.id ? 'highlight' : 'interactive'}
                className="p-0 cursor-pointer overflow-hidden"
                onClick={() => setSelectedMilk(milk.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl">{milk.icon}</span>
                    {selectedMilk === milk.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground">{milk.name}</h3>
                  <p className="text-lg font-bold text-primary">₹{milk.pricePerLiter}/L</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{milk.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Quantity Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Quantity Per Delivery
          </h2>
          <div className="flex flex-wrap gap-2">
            {quantityOptions.map((q) => (
              <button
                key={q}
                onClick={() => setQuantity(q)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                  quantity === q
                    ? 'gradient-fresh text-primary-foreground shadow-glow'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {q} L
              </button>
            ))}
          </div>
        </motion.section>

        {/* Schedule Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Repeat className="w-4 h-4" />
            Delivery Schedule
          </h2>
          <div className="space-y-2">
            {scheduleOptions.map((option) => (
              <Card
                key={option.id}
                variant={scheduleType === option.id ? 'highlight' : 'interactive'}
                className="p-0 cursor-pointer"
                onClick={() => setScheduleType(option.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </div>
                  {scheduleType === option.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Custom Day Picker */}
          {scheduleType === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <p className="text-sm text-muted-foreground mb-3">Select delivery days:</p>
              <div className="flex gap-2 flex-wrap">
                {dayLabels.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => toggleCustomDay(index)}
                    className={`w-12 h-12 rounded-xl font-medium transition-all ${
                      customDays.includes(index)
                        ? 'gradient-fresh text-primary-foreground shadow-glow'
                        : 'bg-secondary text-secondary-foreground hover:bg-accent'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.section>

        {/* Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="fresh">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Monthly Estimate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">
                    {quantity}L × {activeDays.length} days/week × 4 weeks
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ≈ {(quantity * activeDays.length * 4).toFixed(1)} L/month
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">₹{monthlyEstimate.toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground">/month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/95 backdrop-blur-lg border-t border-border max-w-md mx-auto">
        <Button variant="hero" size="lg" className="w-full" onClick={handleSave}>
          {existingSubscription ? 'Save Changes' : 'Start Subscription'}
        </Button>
      </div>
    </MobileLayout>
  );
};
