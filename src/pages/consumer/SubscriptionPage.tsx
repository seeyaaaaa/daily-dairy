import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { useApp, Subscription, PaymentMethod } from '@/contexts/AppContext';
import { ArrowLeft, Check, Calendar, Repeat, Wallet, ChevronDown, ChevronUp, ArrowRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const scheduleOptions = [
  { id: 'daily', label: 'Daily', days: [0, 1, 2, 3, 4, 5, 6], icon: '📅' },
  { id: 'weekdays', label: 'Weekdays Only', days: [1, 2, 3, 4, 5, 6], icon: '🏢' },
  { id: 'custom', label: 'Custom Days', days: [], icon: '✏️' },
];

const quantityOptions = [0.5, 1, 1.5, 2, 2.5, 3];

const paymentMethods: { id: PaymentMethod; label: string; description: string; icon: string }[] = [
  { id: 'cash', label: 'Cash to Milkman', description: 'Pay in cash when milk is delivered', icon: '💵' },
  { id: 'upi', label: 'UPI Payment', description: 'Pay via Google Pay, PhonePe, etc.', icon: '📱' },
  { id: 'bank_transfer', label: 'Bank Transfer', description: 'Direct bank transfer', icon: '🏦' },
  { id: 'card', label: 'Card Payment', description: 'Credit/Debit card (coming soon)', icon: '💳' },
];

type Step = 'milk' | 'schedule' | 'payment' | 'confirm';

export const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { milkBrands, milkProducts, subscriptions, addSubscription, updateSubscription, addresses } = useApp();
  
  const existingSubscription = subscriptions[0];
  
  const [currentStep, setCurrentStep] = useState<Step>('milk');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    existingSubscription?.milkProductId 
      ? milkProducts.find(p => p.id === existingSubscription.milkProductId)?.brandId || null
      : null
  );
  const [selectedMilk, setSelectedMilk] = useState(existingSubscription?.milkProductId || '');
  const [quantity, setQuantity] = useState(existingSubscription?.quantityPerDelivery || 1);
  const [scheduleType, setScheduleType] = useState<string>('daily');
  const [customDays, setCustomDays] = useState<number[]>(existingSubscription?.daysOfWeek || [0, 1, 2, 3, 4, 5, 6]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(existingSubscription?.paymentMethod || 'cash');
  const [expandedBrand, setExpandedBrand] = useState<string | null>(selectedBrand);

  const selectedProduct = milkProducts.find(m => m.id === selectedMilk);
  
  const activeDays = scheduleType === 'custom' 
    ? customDays 
    : scheduleOptions.find(s => s.id === scheduleType)?.days || [];

  const monthlyEstimate = quantity * (selectedProduct?.pricePerLiter || 0) * activeDays.length * 4;

  const steps: Step[] = ['milk', 'schedule', 'payment', 'confirm'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const stepTitles: Record<Step, string> = {
    milk: 'Select Milk',
    schedule: 'Delivery Schedule',
    payment: 'Payment Method',
    confirm: 'Confirm Plan',
  };

  const toggleCustomDay = (day: number) => {
    setCustomDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const handleBrandToggle = (brandId: string) => {
    if (expandedBrand === brandId) {
      setExpandedBrand(null);
    } else {
      setExpandedBrand(brandId);
      setSelectedBrand(brandId);
    }
  };

  const handleMilkSelect = (productId: string, brandId: string) => {
    setSelectedMilk(productId);
    setSelectedBrand(brandId);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'milk':
        return !!selectedMilk;
      case 'schedule':
        return activeDays.length > 0;
      case 'payment':
        return !!paymentMethod;
      case 'confirm':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      if (currentStep === 'milk') toast.error('Please select a milk type');
      if (currentStep === 'schedule') toast.error('Please select at least one delivery day');
      return;
    }
    
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    } else {
      navigate(-1);
    }
  };

  const handleSave = () => {
    const subscriptionData: Subscription = {
      id: existingSubscription?.id || 'sub-' + Date.now(),
      customerId: 'user-1',
      addressId: addresses[0]?.id || 'addr-1',
      milkProductId: selectedMilk,
      quantityPerDelivery: quantity,
      daysOfWeek: activeDays,
      startDate: new Date().toISOString().split('T')[0],
      isActive: true,
      paymentMethod: paymentMethod,
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

  const getBrandProducts = (brandId: string) => {
    return milkProducts.filter(p => p.brandId === brandId);
  };

  return (
    <MobileLayout
      header={
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-2 -ml-2 hover:bg-accent rounded-xl transition-colors">
              {currentStepIndex === 0 ? <ArrowLeft className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-semibold">
              {existingSubscription ? 'Manage Subscription' : stepTitles[currentStep]}
            </h1>
          </div>
          <div className="space-y-1">
            <Progress value={progress} className="h-1.5" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span>{stepTitles[currentStep]}</span>
            </div>
          </div>
        </div>
      }
    >
      <div className="px-5 py-4 space-y-6 pb-32">
        <AnimatePresence mode="wait">
          {/* Step 1: Milk Selection */}
          {currentStep === 'milk' && (
            <motion.div
              key="milk"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Brand & Milk Type Selection */}
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Select Brand & Milk Type
                </h2>
                <div className="space-y-3">
                  {milkBrands.map((brand) => {
                    const products = getBrandProducts(brand.id);
                    const isExpanded = expandedBrand === brand.id;
                    const hasSelectedProduct = products.some(p => p.id === selectedMilk);
                    
                    return (
                      <Card
                        key={brand.id}
                        className={`overflow-hidden transition-all ${hasSelectedProduct ? 'ring-2 ring-primary border-primary' : ''}`}
                      >
                        <button
                          onClick={() => handleBrandToggle(brand.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{brand.logo}</span>
                            <div className="text-left">
                              <p className="font-semibold text-foreground">{brand.name}</p>
                              <p className="text-xs text-muted-foreground">{brand.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasSelectedProduct && (
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary-foreground" />
                              </div>
                            )}
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-3 pt-0 grid grid-cols-1 gap-2">
                                {products.map((milk) => (
                                  <button
                                    key={milk.id}
                                    onClick={() => handleMilkSelect(milk.id, brand.id)}
                                    className={`p-3 rounded-xl flex items-center justify-between transition-all ${
                                      selectedMilk === milk.id
                                        ? 'bg-primary/10 border-2 border-primary'
                                        : 'bg-secondary hover:bg-accent border-2 border-transparent'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-2xl">{milk.icon}</span>
                                      <div className="text-left">
                                        <p className="font-medium text-foreground">{milk.name}</p>
                                        <p className="text-xs text-muted-foreground">{milk.description}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-primary">₹{milk.pricePerLiter}/L</p>
                                      {selectedMilk === milk.id && (
                                        <Check className="w-4 h-4 text-primary ml-auto mt-1" />
                                      )}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    );
                  })}
                </div>
              </section>

              {/* Quantity Selection */}
              <section>
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
              </section>
            </motion.div>
          )}

          {/* Step 2: Schedule */}
          {currentStep === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <section>
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
              </section>

              {/* Selected Summary */}
              <Card variant="fresh" className="mt-4">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedProduct?.icon}</span>
                    <div>
                      <p className="font-semibold">{selectedProduct?.name}</p>
                      <p className="text-sm text-muted-foreground">{quantity}L × {activeDays.length} days/week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Payment Method
                </h2>
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <Card
                      key={method.id}
                      className={`p-0 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'ring-2 ring-primary border-primary bg-primary/5'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <p className="font-medium text-foreground">{method.label}</p>
                            <p className="text-xs text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                        {paymentMethod === method.id && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  💡 No online payment gateway integrated. Payment is handled offline.
                </p>
              </section>
            </motion.div>
          )}

          {/* Step 4: Confirm */}
          {currentStep === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Review Your Plan</h2>
                <p className="text-muted-foreground">Make sure everything looks good</p>
              </div>

              <Card variant="fresh">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Selected Milk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedProduct?.icon}</span>
                    <div>
                      <p className="font-semibold">{selectedProduct?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {milkBrands.find(b => b.id === selectedProduct?.brandId)?.name}
                      </p>
                    </div>
                    <p className="ml-auto font-bold text-primary">₹{selectedProduct?.pricePerLiter}/L</p>
                  </div>
                </CardContent>
              </Card>

              <Card variant="fresh">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Delivery Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium">{quantity}L per delivery</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schedule</span>
                    <span className="font-medium">{activeDays.length} days/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days</span>
                    <span className="font-medium text-right max-w-[150px]">
                      {activeDays.map(d => dayLabels[d]).join(', ')}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card variant="fresh">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{paymentMethods.find(m => m.id === paymentMethod)?.icon}</span>
                    <div>
                      <p className="font-medium">{paymentMethods.find(m => m.id === paymentMethod)?.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {paymentMethods.find(m => m.id === paymentMethod)?.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="fresh" className="bg-primary/5">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/95 backdrop-blur-lg border-t border-border max-w-md mx-auto">
        {currentStep === 'confirm' ? (
          <Button variant="hero" size="lg" className="w-full" onClick={handleSave}>
            {existingSubscription ? 'Save Changes' : 'Start Subscription'}
          </Button>
        ) : (
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full group" 
            onClick={handleNext}
            disabled={!canProceed()}
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
      </div>
    </MobileLayout>
  );
};