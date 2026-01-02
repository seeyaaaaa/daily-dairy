import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Droplets, BarChart3, Calendar, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';

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

export const OnboardingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/auth');
    }
  };

  const handleSkip = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background max-w-md mx-auto overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 pt-8">
        <Logo size="sm" showText={false} />
        <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
          Skip
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex flex-col justify-center px-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
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
        </AnimatePresence>
      </div>

      {/* Pagination & Actions */}
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
          onClick={handleNext}
        >
          <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};