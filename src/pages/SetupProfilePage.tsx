import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp, Address } from '@/contexts/AppContext';
import { ArrowRight, MapPin, Clock, Check } from 'lucide-react';
import { toast } from 'sonner';

const deliverySlots = [
  { id: '5-6', label: '5:00 - 6:00 AM', shortLabel: '5-6 AM', icon: '🌅', description: 'Early bird delivery' },
  { id: '6-7', label: '6:00 - 7:00 AM', shortLabel: '6-7 AM', icon: '☀️', description: 'Morning fresh' },
  { id: '7-8', label: '7:00 - 8:00 AM', shortLabel: '7-8 AM', icon: '🌞', description: 'Breakfast time' },
  { id: '8-9', label: '8:00 - 9:00 AM', shortLabel: '8-9 AM', icon: '🏠', description: 'Late morning' },
  { id: 'custom', label: 'Custom Time', shortLabel: 'Custom', icon: '⏰', description: 'Choose your time' },
];

export const SetupProfilePage: React.FC = () => {
  const [step, setStep] = useState<'name' | 'address'>('name');
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

  const handleNameSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    setUser({ ...user!, name });
    setStep('address');
  };

  const handleAddressSubmit = () => {
    if (!flat.trim() || !building.trim() || !area.trim()) {
      toast.error('Please fill in the required fields');
      return;
    }

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

  return (
    <div className="min-h-screen flex flex-col bg-background max-w-md mx-auto">
      {/* Progress */}
      <div className="p-6 pt-8">
        <div className="flex items-center gap-2 mb-6">
          <div className={`h-1.5 rounded-full flex-1 transition-colors ${step === 'name' || step === 'address' ? 'bg-primary' : 'bg-border'}`} />
          <div className={`h-1.5 rounded-full flex-1 transition-colors ${step === 'address' ? 'bg-primary' : 'bg-border'}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        {step === 'name' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">What's your name?</h1>
              <p className="text-muted-foreground">So we know what to call you</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Riya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 mt-2"
                />
              </div>
            </div>

            <Button 
              variant="fresh" 
              size="lg" 
              className="w-full mt-8" 
              onClick={handleNameSubmit}
              disabled={!name.trim()}
            >
              Next: Add Address
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 'address' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-8"
          >
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Delivery Address</h1>
              <p className="text-muted-foreground">Where should we deliver your milk?</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="flat">Flat/House No. *</Label>
                  <Input
                    id="flat"
                    placeholder="e.g. A-101"
                    value={flat}
                    onChange={(e) => setFlat(e.target.value)}
                    className="h-11 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="building">Building *</Label>
                  <Input
                    id="building"
                    placeholder="e.g. Sunrise Towers"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="h-11 mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="area">Area/Street *</Label>
                <Input
                  id="area"
                  placeholder="e.g. MG Road"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="h-11 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  placeholder="e.g. Near City Mall"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="h-11 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    placeholder="e.g. 400001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="h-11 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-11 mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Slot - Enhanced */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <Label className="text-base font-semibold">Preferred Delivery Time</Label>
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
            </div>

            <Button 
              variant="fresh" 
              size="lg" 
              className="w-full mt-4" 
              onClick={handleAddressSubmit}
              disabled={!flat.trim() || !building.trim() || !area.trim()}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Save & Continue
            </Button>

            <button 
              onClick={() => setStep('name')}
              className="w-full text-center text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              ← Back to name
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
