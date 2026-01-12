import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useApp, Language } from '@/contexts/AppContext';
import { Droplets, BarChart3, Calendar, ArrowRight, ChevronRight, Sparkles, LogIn, UserPlus, Globe, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const slides = [
  {
    icon: Droplets,
    emoji: '🥛',
    title: 'Fresh milk at your doorstep',
    subtitle: 'Every morning, straight from the dairy to your home',
    color: 'from-primary/30 via-primary/20 to-accent',
  },
  {
    icon: BarChart3,
    emoji: '📊',
    title: 'Track deliveries & bills',
    subtitle: 'Know exactly what you received and never overpay',
    color: 'from-emerald-500/20 via-teal-500/20 to-accent',
  },
  {
    icon: Calendar,
    emoji: '✨',
    title: 'Pause or change anytime',
    subtitle: 'Going out of town? Pause with just one tap',
    color: 'from-amber-500/20 via-orange-500/20 to-accent',
  },
];

const languages: { id: Language; name: string; nativeName: string; flag: string }[] = [
  { id: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { id: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
];

type ScreenType = 'slides' | 'language' | 'auth';

export const OnboardingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [screen, setScreen] = useState<ScreenType>('slides');
  const navigate = useNavigate();
  const { setAuthMode, language, setLanguage } = useApp();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSkip = () => {
    setScreen('language');
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  const handleLanguageContinue = () => {
    setScreen('auth');
  };

  const handleLogin = () => {
    setAuthMode('login');
    navigate('/auth');
  };

  const handleSignup = () => {
    setAuthMode('signup');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background max-w-md mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 pt-8">
        <Logo size="sm" showText={false} />
        {screen === 'slides' && (
          <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
            Skip
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-8 relative">
        <AnimatePresence mode="wait">
          {/* Slides */}
          {screen === 'slides' && (
            <motion.div
              key={`slide-${currentSlide}`}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-center"
            >
              {/* Decorative background */}
              <div className={`absolute inset-0 bg-gradient-to-b ${slides[currentSlide].color} opacity-40 blur-3xl -z-10`} />
              
              {/* Icon container with floating animation */}
              <motion.div 
                className="relative w-40 h-40 mx-auto mb-10"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 rounded-[2.5rem] gradient-brand opacity-20 blur-xl" />
                <div className="relative w-full h-full rounded-[2.5rem] gradient-card shadow-elevated border border-border/50 flex items-center justify-center">
                  <span className="text-7xl">{slides[currentSlide].emoji}</span>
                </div>
                {/* Sparkle decorations */}
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-primary" />
                </motion.div>
              </motion.div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-foreground mb-4 text-balance leading-tight">
                {slides[currentSlide].title}
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-muted-foreground text-balance max-w-[280px] mx-auto">
                {slides[currentSlide].subtitle}
              </p>
            </motion.div>
          )}

          {/* Language Selection */}
          {screen === 'language' && (
            <motion.div
              key="language"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-8 h-8 text-primary" />
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-2">
                Choose Your Language
              </h1>
              <p className="text-muted-foreground mb-8">
                Select your preferred language
              </p>

              <div className="space-y-3">
                {languages.map((lang) => (
                  <Card 
                    key={lang.id}
                    className={`p-0 cursor-pointer transition-all ${
                      language === lang.id 
                        ? 'ring-2 ring-primary border-primary bg-primary/5' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleLanguageSelect(lang.id)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{lang.flag}</span>
                        <div className="text-left">
                          <p className="font-semibold text-foreground">{lang.nativeName}</p>
                          <p className="text-sm text-muted-foreground">{lang.name}</p>
                        </div>
                      </div>
                      {language === lang.id && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button 
                variant="hero" 
                size="xl" 
                className="w-full mt-8 group" 
                onClick={handleLanguageContinue}
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          )}

          {/* Auth Options */}
          {screen === 'auth' && (
            <motion.div
              key="auth-options"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              {/* Logo */}
              <div className="mb-8">
                <Logo size="xl" className="justify-center" />
              </div>

              {/* Welcome text */}
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Welcome to MilkMate
              </h1>
              <p className="text-muted-foreground mb-8">
                Fresh milk delivered to your doorstep, every day
              </p>

              {/* Auth Options */}
              <div className="space-y-4">
                <Button 
                  variant="hero" 
                  size="xl" 
                  className="w-full group" 
                  onClick={handleSignup}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  <span>Sign Up</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button 
                  variant="outline" 
                  size="xl" 
                  className="w-full group border-2" 
                  onClick={handleLogin}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-8">
                By continuing, you agree to our{' '}
                <span className="text-primary">Terms of Service</span> and{' '}
                <span className="text-primary">Privacy Policy</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination & Actions */}
      {screen === 'slides' && (
        <div className="p-8 space-y-8">
          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="relative h-2 rounded-full transition-all duration-300 overflow-hidden"
                style={{ width: index === currentSlide ? 32 : 8 }}
              >
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'gradient-brand' 
                    : 'bg-border hover:bg-muted-foreground/30'
                }`} />
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <Button 
            variant="hero" 
            size="xl" 
            className="w-full group" 
            onClick={currentSlide === slides.length - 1 ? handleSkip : handleNext}
          >
            <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      )}
    </div>
  );
};