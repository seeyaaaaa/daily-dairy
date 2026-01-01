import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { User, Store, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'role' | 'phone' | 'otp';

export const AuthPage: React.FC = () => {
  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<'consumer' | 'owner' | null>(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setIsOnboarded } = useApp();

  const handleRoleSelect = (role: 'consumer' | 'owner') => {
    setSelectedRole(role);
    setStep('phone');
  };

  const handlePhoneSubmit = async () => {
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    setIsLoading(true);
    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast.success('OTP sent to +91 ' + phone);
    setStep('otp');
  };

  const handleOtpSubmit = async () => {
    if (otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }
    setIsLoading(true);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    setUser({
      id: 'user-' + Date.now(),
      phone: '+91' + phone,
      name: selectedRole === 'owner' ? 'Sharma Dairy' : '',
      role: selectedRole,
    });
    
    setIsLoading(false);
    toast.success('Welcome!');
    
    if (selectedRole === 'consumer') {
      navigate('/setup-profile');
    } else {
      setIsOnboarded(true);
      navigate('/owner');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-background max-w-md mx-auto ${selectedRole === 'owner' ? 'owner-theme' : ''}`}>
      {/* Header */}
      <div className="p-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-fresh flex items-center justify-center shadow-glow">
            <span className="text-3xl">🥛</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">DailyDairy</h1>
          <p className="text-muted-foreground mt-1">Your milk delivery companion</p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        {step === 'role' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-center mb-6">I am a...</h2>
            
            <Card 
              variant="interactive"
              className="p-0"
              onClick={() => handleRoleSelect('consumer')}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Customer</h3>
                  <p className="text-sm text-muted-foreground">I want to order milk</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card 
              variant="interactive"
              className="p-0"
              onClick={() => handleRoleSelect('owner')}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-owner-accent flex items-center justify-center">
                  <Store className="w-7 h-7 text-owner-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Milk Shop Owner</h3>
                  <p className="text-sm text-muted-foreground">I deliver milk</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'phone' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Enter your phone number</h2>
              <p className="text-muted-foreground text-sm">We'll send you an OTP to verify</p>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                <Phone className="w-5 h-5" />
                <span className="font-medium">+91</span>
              </div>
              <Input
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="pl-24 h-14 text-lg"
                maxLength={10}
              />
            </div>

            <Button 
              variant="fresh" 
              size="lg" 
              className="w-full" 
              onClick={handlePhoneSubmit}
              disabled={isLoading || phone.length < 10}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get OTP'}
            </Button>

            <button 
              onClick={() => setStep('role')}
              className="w-full text-center text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              ← Back to role selection
            </button>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Enter OTP</h2>
              <p className="text-muted-foreground text-sm">Sent to +91 {phone}</p>
            </div>

            <Input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="h-14 text-lg text-center tracking-[0.5em]"
              maxLength={6}
            />

            <Button 
              variant="fresh" 
              size="lg" 
              className="w-full" 
              onClick={handleOtpSubmit}
              disabled={isLoading || otp.length < 4}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
            </Button>

            <div className="text-center space-y-2">
              <button className="text-primary text-sm font-medium hover:underline">
                Resend OTP
              </button>
              <p className="text-muted-foreground text-xs">
                Didn't receive? Wait 30 seconds
              </p>
            </div>

            <button 
              onClick={() => setStep('phone')}
              className="w-full text-center text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              ← Change phone number
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 text-center text-xs text-muted-foreground">
        By continuing, you agree to our Terms & Privacy Policy
      </div>
    </div>
  );
};
