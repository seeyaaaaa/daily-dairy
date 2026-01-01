import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Droplets, BarChart3, Calendar, ArrowRight, ChevronRight } from 'lucide-react';

const slides = [
  {
    icon: Droplets,
    title: 'Fresh milk at your doorstep',
    subtitle: 'Every morning, straight from the dairy',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    icon: BarChart3,
    title: 'Track deliveries & bills',
    subtitle: 'Know exactly what you received and paid',
    gradient: 'from-accent to-secondary',
  },
  {
    icon: Calendar,
    title: 'Pause or change anytime',
    subtitle: 'No more confusion with daily modifications',
    gradient: 'from-primary/10 to-accent',
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
    <div className="min-h-screen flex flex-col bg-background max-w-md mx-auto">
      {/* Skip button */}
      <div className="flex justify-end p-4">
        <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
          Skip
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex flex-col justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {/* Icon */}
            <div className={`w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${slides[currentSlide].gradient} flex items-center justify-center`}>
              {React.createElement(slides[currentSlide].icon, { 
                className: "w-16 h-16 text-primary" 
              })}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground mb-4 text-balance">
              {slides[currentSlide].title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground text-balance">
              {slides[currentSlide].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination & Actions */}
      <div className="p-8 space-y-6">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-primary' 
                  : 'w-2 bg-border hover:bg-muted-foreground'
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <Button 
          variant="hero" 
          size="xl" 
          className="w-full" 
          onClick={handleNext}
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
