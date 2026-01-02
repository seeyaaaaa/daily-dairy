import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { useApp } from '@/contexts/AppContext';
import { User, Store, Phone, ArrowRight, Loader2, Shield, ChevronLeft } from 'lucide-react';
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser({
      id: 'user-' + Date.now(),
      phone: '+91' + phone,
      name: selectedRole === 'owner' ? 'Sharma Dairy' : '',
      role: selectedRole,
    });
    
    setIsLoading(false);
    toast.success('Welcome to MilkMate!');
    
    if (selectedRole === 'consumer') {
      navigate('/setup-profile');
    } else {
      setIsOnboarded(true);
      navigate('/owner');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-background max-w-md mx-auto ${selectedRole === 'owner' ? 'owner-theme' : ''}`}>
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      {/* Header */}
      <div className="relative p-6 pt-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <Logo size="lg" isOwner={selectedRole === 'owner'} />
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-8 relative z-10">
        {step === 'role' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Welcome!</h2>
              <p className="text-muted-foreground mt-2">How would you like to use MilkMate?</p>
            </div>
            
            <Card 
              variant="interactive"
              className="p-0 overflow-hidden group"
              onClick={() => handleRoleSelect('consumer')}
            >
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-5">
                  <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-primary group-hover:scale-105 transition-transform">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">I'm a Customer</h3>
                    <p className="text-sm text-muted-foreground">Order fresh milk daily</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>

            <Card 
              variant="interactive"
              className="p-0 overflow-hidden group"
              onClick={() => handleRoleSelect('owner')}
            >
              <CardContent className="p-0">
                <div className="flex items-center gap-4 p-5">
                  <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--owner-primary))] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Store className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">I'm a Milk Shop</h3>
                    <p className="text-sm text-muted-foreground">Manage deliveries & customers</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-[hsl(var(--owner-primary))] group-hover:translate-x-1 transition-all" />
                </div>
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
            <button 
              onClick={() => setStep('role')}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent flex items-center justify-center">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Enter your phone</h2>
              <p className="text-muted-foreground">We'll send you a verification code</p>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-foreground font-medium">
                <span className="text-xl">🇮🇳</span>
                <span>+91</span>
              </div>
              <Input
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="pl-24 h-14 text-lg font-medium tracking-wide"
                maxLength={10}
              />
            </div>

            <Button 
              variant="hero" 
              size="lg" 
              className="w-full" 
              onClick={handlePhoneSubmit}
              disabled={isLoading || phone.length < 10}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Get OTP</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <button 
              onClick={() => setStep('phone')}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Verify OTP</h2>
              <p className="text-muted-foreground">Sent to +91 {phone}</p>
            </div>

            <Input
              type="text"
              placeholder="• • • • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="h-16 text-2xl text-center tracking-[0.75em] font-bold"
              maxLength={6}
            />

            <Button 
              variant="hero" 
              size="lg" 
              className="w-full" 
              onClick={handleOtpSubmit}
              disabled={isLoading || otp.length < 4}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Verify & Continue</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <div className="text-center space-y-3">
              <button className="text-primary text-sm font-semibold hover:underline">
                Resend OTP
              </button>
              <p className="text-muted-foreground text-xs">
                Didn't receive? Wait 30 seconds
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 p-6 text-center text-xs text-muted-foreground">
        By continuing, you agree to our <span className="text-primary">Terms</span> & <span className="text-primary">Privacy Policy</span>
      </div>
    </div>
  );
};