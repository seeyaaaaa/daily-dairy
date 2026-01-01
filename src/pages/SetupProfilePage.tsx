import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp, Address } from '@/contexts/AppContext';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

const deliverySlots = [
  { id: '5-6', label: '5:00 - 6:00 AM', icon: '🌅' },
  { id: '6-7', label: '6:00 - 7:00 AM', icon: '☀️' },
  { id: '7-8', label: '7:00 - 8:00 AM', icon: '🌞' },
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

            {/* Delivery Slot */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-primary" />
                <Label>Preferred Delivery Time</Label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {deliverySlots.map((slot) => (
                  <Card
                    key={slot.id}
                    variant={selectedSlot === slot.id ? 'highlight' : 'interactive'}
                    className="p-0 cursor-pointer"
                    onClick={() => setSelectedSlot(slot.id)}
                  >
                    <CardContent className="p-3 text-center">
                      <span className="text-2xl block mb-1">{slot.icon}</span>
                      <span className="text-xs font-medium">{slot.label.split(' - ')[0]}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
