import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, RefreshCw, Truck, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Location {
  latitude: number;
  longitude: number;
  timestamp?: number;
}

interface LiveLocationMapProps {
  milkmanLocation?: Location | null;
  customerLocation?: Location | null;
  isTracking?: boolean;
  onRefresh?: () => void;
  estimatedArrival?: string;
  milkmanName?: string;
}

export const LiveLocationMap: React.FC<LiveLocationMapProps> = ({
  milkmanLocation,
  customerLocation,
  isTracking = false,
  onRefresh,
  estimatedArrival,
  milkmanName = 'Milkman',
}) => {
  const [distance, setDistance] = useState<string | null>(null);

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (milkmanLocation && customerLocation) {
      const dist = calculateDistance(
        milkmanLocation.latitude,
        milkmanLocation.longitude,
        customerLocation.latitude,
        customerLocation.longitude
      );
      if (dist < 1) {
        setDistance(`${Math.round(dist * 1000)}m away`);
      } else {
        setDistance(`${dist.toFixed(1)}km away`);
      }
    }
  }, [milkmanLocation, customerLocation]);

  // Simulated map visualization (in production, use Mapbox or Google Maps)
  const MapVisualization = () => (
    <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5">
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 grid-rows-6 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-primary/20" />
          ))}
        </div>
      </div>

      {/* Road lines */}
      <svg className="absolute inset-0 w-full h-full">
        <path
          d="M 20,100 Q 80,60 140,80 T 260,100 T 380,80"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="3"
          strokeDasharray="10,5"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M 100,20 Q 120,60 100,100 T 120,180"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="3"
          strokeDasharray="10,5"
          fill="none"
          opacity="0.3"
        />
      </svg>

      {/* Customer home marker */}
      {customerLocation && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-8 bottom-8"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45 -z-10" />
          </div>
        </motion.div>
      )}

      {/* Milkman marker with animation */}
      {milkmanLocation && isTracking && (
        <motion.div
          initial={{ x: 20, y: 100 }}
          animate={{ 
            x: [20, 60, 100, 140],
            y: [100, 80, 90, 100]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute"
        >
          <div className="relative">
            {/* Pulse effect */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 w-12 h-12 -m-1 rounded-full bg-amber-500/30"
            />
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-2 border-white">
              <Truck className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Not tracking state */}
      {!isTracking && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Tracking not active</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <MapVisualization />
        
        {isTracking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 space-y-3"
          >
            {/* Milkman info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-lg">🧑‍🌾</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{milkmanName}</p>
                  <p className="text-xs text-muted-foreground">
                    {distance || 'Calculating...'}
                  </p>
                </div>
              </div>
              
              <AnimatePresence>
                {estimatedArrival && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-right"
                  >
                    <p className="text-xs text-muted-foreground">ETA</p>
                    <p className="font-bold text-primary">{estimatedArrival}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {onRefresh && (
                <Button variant="outline" size="sm" onClick={onRefresh} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              )}
              <Button 
                variant="soft" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  if (milkmanLocation) {
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${milkmanLocation.latitude},${milkmanLocation.longitude}`,
                      '_blank'
                    );
                  }
                }}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Directions
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
