import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useApp, Address } from '@/contexts/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowRight, MapPin, Clock, Check, ChevronLeft, User, Home, Building } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'name' | 'address-basic' | 'address-detail' | 'delivery-time';

const deliverySlots = [
  { id: '5-6', label: '5:00 - 6:00 AM', icon: '🌅', description: 'Early bird delivery' },
  { id: '6-7', label: '6:00 - 7:00 AM', icon: '☀️', description: 'Morning fresh' },
  { id: '7-8', label: '7:00 - 8:00 AM', icon: '🌞', description: 'Breakfast time' },
  { id: '8-9', label: '8:00 - 9:00 AM', icon: '🏠', description: 'Late morning' },
  { id: 'custom', label: 'Custom Time', icon: '⏰', description: 'Choose your time' },
];

export const SetupProfilePage: React.FC = () => {
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [flat, setFlat] = useState('');
  const [building, setBuilding] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('6-7');
  const [customTime, setCustomTime] = useState('06:30');
  
  const navigate = useNavigate();
  const { user, setUser, addAddress, setIsOnboarded } = useApp();
  const { t } = useTranslation();

  const steps: Step[] = ['name', 'address-basic', 'address-detail', 'delivery-time'];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
    }
  };

  const handleNameSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setUser({ ...user!, name });
    setStep('address-basic');
  };

  const handleAddressBasicSubmit = () => {
    if (!flat.trim() || !building.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setStep('address-detail');
  };

  const handleAddressDetailSubmit = () => {
    if (!area.trim()) {
      toast.error('Please enter your area');
      return;
    }
    setStep('delivery-time');
  };

  const handleComplete = () => {
    const address: Address = {
      id: 'addr-' + Date.now(),
      flat,
      building,
      area,
      landmark,
      pincode,
      city,
      deliverySlot: selectedSlot,
      customSlotTime: selectedSlot === 'custom' ? customTime : undefined,
      isDefault: true,
    };

    addAddress(address);
    setIsOnboarded(true);
    toast.success('Profile setup complete!');
    navigate('/consumer');
  };

  const stepTitles: Record<Step, { title: string; subtitle: string; icon: React.ElementType }> = {
    'name': { 
      title: t('whats_your_name'), 
      subtitle: t('so_we_know'),
      icon: User
    },
    'address-basic': { 
      title: t('flat_house') + ' & ' + t('building'), 
      subtitle: t('where_deliver'),
      icon: Home
    },
    'address-detail': { 
      title: t('area_street') + ' & ' + t('city'), 
      subtitle: 'Complete your address',
      icon: Building
    },
    'delivery-time': { 
      title: t('preferred_delivery_time'), 
      subtitle: 'When should we deliver?',
      icon: Clock
    },
  };

  const currentStepInfo = stepTitles[step];
  const StepIcon = currentStepInfo.icon;

  return (
    <div className="min-h-screen flex flex-col bg-background max-w-md mx-auto">
      {/* Header with Progress */}
      <div className="p-5 pt-8 space-y-4">
        <div className="flex items-center gap-3">
          {currentStepIndex > 0 && (
            <button 
              onClick={handleBack} 
              className="p-2 -ml-2 hover:bg-accent rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1">
            <Progress value={progress} className="h-1.5" />
          </div>
          <span className="text-xs text-muted-foreground">
            {currentStepIndex + 1}/{steps.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        <AnimatePresence mode="wait">
          {/* Step: Name */}
          {step === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <StepIcon className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">{currentStepInfo.title}</h1>
                <p className="text-muted-foreground">{currentStepInfo.subtitle}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('full_name')}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. Riya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 mt-2 text-lg"
                    autoFocus
                  />
                </div>
              </div>

              <Button 
                variant="hero" 
                size="lg" 
                className="w-full mt-8" 
                onClick={handleNameSubmit}
                disabled={!name.trim()}
              >
                {t('next')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step: Address Basic (Flat & Building) */}
          {step === 'address-basic' && (
            <motion.div
              key="address-basic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <StepIcon className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">{currentStepInfo.title}</h1>
                <p className="text-muted-foreground">{currentStepInfo.subtitle}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="flat">{t('flat_house')} *</Label>
                  <Input
                    id="flat"
                    placeholder="e.g. A-101"
                    value={flat}
                    onChange={(e) => setFlat(e.target.value)}
                    className="h-12 mt-1"
                    autoFocus
                  />
                </div>
                <div>
                  <Label htmlFor="building">{t('building')} *</Label>
                  <Input
                    id="building"
                    placeholder="e.g. Sunrise Towers"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="h-12 mt-1"
                  />
                </div>
              </div>

              <Button 
                variant="hero" 
                size="lg" 
                className="w-full mt-8" 
                onClick={handleAddressBasicSubmit}
                disabled={!flat.trim() || !building.trim()}
              >
                {t('next')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step: Address Detail (Area, Landmark, Pincode, City) */}
          {step === 'address-detail' && (
            <motion.div
              key="address-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <StepIcon className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">{currentStepInfo.title}</h1>
                <p className="text-muted-foreground">{currentStepInfo.subtitle}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="area">{t('area_street')} *</Label>
                  <Input
                    id="area"
                    placeholder="e.g. MG Road"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="h-12 mt-1"
                    autoFocus
                  />
                </div>
                <div>
                  <Label htmlFor="landmark">{t('landmark')}</Label>
                  <Input
                    id="landmark"
                    placeholder="e.g. Near City Mall"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="h-12 mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pincode">{t('pincode')}</Label>
                    <Input
                      id="pincode"
                      placeholder="e.g. 411001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="h-12 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">{t('city')}</Label>
                    <Input
                      id="city"
                      placeholder="e.g. Pune"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-12 mt-1"
                    />
                  </div>
                </div>
              </div>

              <Button 
                variant="hero" 
                size="lg" 
                className="w-full mt-6" 
                onClick={handleAddressDetailSubmit}
                disabled={!area.trim()}
              >
                {t('next')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* Step: Delivery Time */}
          {step === 'delivery-time' && (
            <motion.div
              key="delivery-time"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <StepIcon className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">{currentStepInfo.title}</h1>
                <p className="text-muted-foreground">{currentStepInfo.subtitle}</p>
              </div>

              <div className="space-y-2">
                {deliverySlots.map((slot) => (
                  <Card
                    key={slot.id}
                    className={`cursor-pointer transition-all duration-200 overflow-hidden ${
                      selectedSlot === slot.id 
                        ? 'ring-2 ring-primary bg-primary/5 border-primary shadow-md' 
                        : 'hover:border-primary/50 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedSlot(slot.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        selectedSlot === slot.id ? 'bg-primary/10' : 'bg-secondary'
                      }`}>
                        {slot.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold ${selectedSlot === slot.id ? 'text-primary' : 'text-foreground'}`}>
                          {slot.label}
                        </p>
                        <p className="text-sm text-muted-foreground">{slot.description}</p>
                      </div>
                      {selectedSlot === slot.id && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Custom time picker */}
              {selectedSlot === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4"
                >
                  <Label htmlFor="customTime" className="text-sm text-muted-foreground">Select exact time:</Label>
                  <Input
                    id="customTime"
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="h-12 mt-2 text-lg"
                    min="04:00"
                    max="10:00"
                  />
                </motion.div>
              )}

              <Button 
                variant="hero" 
                size="lg" 
                className="w-full mt-4" 
                onClick={handleComplete}
              >
                <MapPin className="w-5 h-5 mr-2" />
                {t('save_continue')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
