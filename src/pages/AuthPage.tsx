import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { useApp } from '@/contexts/AppContext';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { User, Store, Phone, ArrowRight, Loader2, Shield, ChevronLeft, Bell, Check, X, MapPin, Building } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'role' | 'phone' | 'otp' | 'vendor-details' | 'notifications';

export const AuthPage: React.FC = () => {
  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<'consumer' | 'owner' | null>(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  // Vendor details
  const [dairyName, setDairyName] = useState('');
  const [dairyAddress, setDairyAddress] = useState('');
  const [dairyArea, setDairyArea] = useState('');
  
  const navigate = useNavigate();
  const { setUser, setIsOnboarded, authMode, setAuthMode } = useApp();
  const { supported, requestPermission } = usePushNotifications();

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

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
    
    // Mock OTP - simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('OTP sent to +91 ' + phone);
    setResendTimer(30);
    setStep('otp');
    
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    
    // Mock resend OTP
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast.success('OTP resent successfully');
    setResendTimer(30);
    
    setIsLoading(false);
  };

  const handleOtpSubmit = async () => {
    if (otp.length < 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    
    // Mock OTP verification - any 6 digit OTP works
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For vendor, ask for dairy details first
    if (selectedRole === 'owner') {
      setStep('vendor-details');
    } else {
      setStep('notifications');
    }
    setIsLoading(false);
  };

  const handleVendorDetailsSubmit = () => {
    if (!dairyName.trim()) {
      toast.error('Please enter your dairy name');
      return;
    }
    if (!dairyAddress.trim()) {
      toast.error('Please enter your dairy address');
      return;
    }
    
    setStep('notifications');
  };

  const handleNotificationChoice = async (enable: boolean) => {
    if (enable && supported) {
      const granted = await requestPermission();
      if (granted) {
        toast.success('Notifications enabled!');
      }
    }
    
    // Complete the authentication
    completeAuth();
  };

  const completeAuth = () => {
    const isNewUser = authMode === 'signup';
    
    setUser({
      id: 'user-' + Date.now(),
      phone: '+91' + phone,
      name: selectedRole === 'owner' ? dairyName : '',
      role: selectedRole,
      isNewUser,
      dairyAddress: selectedRole === 'owner' ? dairyAddress : undefined,
      dairyArea: selectedRole === 'owner' ? dairyArea : undefined,
    });
    
    toast.success('Welcome to MilkMate!');
    
    if (selectedRole === 'consumer') {
      navigate('/setup-profile');
    } else {
      setIsOnboarded(true);
      navigate('/owner');
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'phone':
        setStep('role');
        break;
      case 'otp':
        setStep('phone');
        break;
      case 'vendor-details':
        setStep('otp');
        break;
      case 'notifications':
        if (selectedRole === 'owner') {
          setStep('vendor-details');
        } else {
          setStep('otp');
        }
        break;
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
        <AnimatePresence mode="wait">
          {step === 'role' && (
            <motion.div
              key="role"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-5"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  {authMode === 'login' ? 'Welcome Back!' : 'Create Account'}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {authMode === 'login' ? 'Login to continue using MilkMate' : 'How would you like to use MilkMate?'}
                </p>
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

              {/* Toggle between Login/Signup */}
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                  {' '}
                  <button
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="text-primary font-semibold hover:underline"
                  >
                    {authMode === 'login' ? 'Sign Up' : 'Login'}
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {step === 'phone' && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <button 
                onClick={handleBack}
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
              key="otp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <button 
                onClick={handleBack}
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
                disabled={isLoading || otp.length < 6}
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
                <button 
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isLoading}
                  className={`text-sm font-semibold ${resendTimer > 0 ? 'text-muted-foreground' : 'text-primary hover:underline'}`}
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'vendor-details' && (
            <motion.div
              key="vendor-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <button 
                onClick={handleBack}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[hsl(var(--owner-primary))]/10 flex items-center justify-center">
                  <Building className="w-8 h-8 text-[hsl(var(--owner-primary))]" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Your Dairy Details</h2>
                <p className="text-muted-foreground">Tell us about your milk shop</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Dairy / Shop Name *</label>
                  <Input
                    placeholder="e.g., Sharma Dairy"
                    value={dairyName}
                    onChange={(e) => setDairyName(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Shop Address *</label>
                  <Input
                    placeholder="e.g., Shop No. 5, Main Market"
                    value={dairyAddress}
                    onChange={(e) => setDairyAddress(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Area in Pune</label>
                  <Input
                    placeholder="e.g., Kothrud, Baner, Wakad"
                    value={dairyArea}
                    onChange={(e) => setDairyArea(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>

              <Button 
                variant="hero" 
                size="lg" 
                className="w-full" 
                onClick={handleVendorDetailsSubmit}
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {step === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Bell className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Stay Updated!</h2>
                <p className="text-muted-foreground">
                  Get notified about your milk deliveries, bills, and important updates.
                </p>
              </div>

              <Card className="p-4 bg-accent/50">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm text-foreground">Delivery status updates</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm text-foreground">Bill reminders</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-sm text-foreground">Special offers & updates</p>
                  </div>
                </div>
              </Card>

              <div className="space-y-3">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full" 
                  onClick={() => handleNotificationChoice(true)}
                >
                  <Bell className="w-5 h-5 mr-2" />
                  Enable Notifications
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="w-full text-muted-foreground" 
                  onClick={() => handleNotificationChoice(false)}
                >
                  Maybe Later
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="relative z-10 p-6 text-center text-xs text-muted-foreground">
        By continuing, you agree to our <span className="text-primary">Terms</span> & <span className="text-primary">Privacy Policy</span>
      </div>
    </div>
  );
};