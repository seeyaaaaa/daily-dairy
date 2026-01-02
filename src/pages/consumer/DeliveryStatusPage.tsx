import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { LiveLocationMap } from '@/components/LiveLocationMap';
import { useGeolocation } from '@/hooks/useGeolocation';
import { usePushNotifications, notificationTemplates } from '@/hooks/usePushNotifications';
import { 
  ArrowLeft, CheckCircle, Circle, Truck, AlertCircle, 
  Bell, BellOff, Phone, MapPin, Clock, Navigation
} from 'lucide-react';
import { toast } from 'sonner';

// Mock delivery status
const mockDeliveryStatus = {
  status: 'out_for_delivery' as const,
  steps: [
    { id: 'accepted', label: 'Order Accepted', time: '5:30 AM', completed: true },
    { id: 'out_for_delivery', label: 'Out for Delivery', time: '6:00 AM', completed: true },
    { id: 'delivered', label: 'Delivered', time: null, completed: false },
  ],
  milkman: {
    name: 'Ramesh Kumar',
    phone: '+91 98765 00000',
  },
  expectedTime: '6:15 - 6:30 AM',
  isTracking: true,
};

// Simulated milkman location (would come from backend in production)
const simulatedMilkmanLocation = {
  latitude: 19.1136,
  longitude: 72.8697,
  timestamp: Date.now(),
};

export const DeliveryStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const [deliveryStatus, setDeliveryStatus] = useState(mockDeliveryStatus);
  const [milkmanLocation, setMilkmanLocation] = useState(simulatedMilkmanLocation);
  
  const { latitude, longitude, loading: locationLoading } = useGeolocation({ watchPosition: false });
  const { enabled: notificationsEnabled, requestPermission, sendNotification } = usePushNotifications();

  // Simulate milkman movement
  useEffect(() => {
    if (!deliveryStatus.isTracking) return;

    const interval = setInterval(() => {
      setMilkmanLocation(prev => ({
        ...prev,
        latitude: prev.latitude + (Math.random() - 0.3) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.3) * 0.001,
        timestamp: Date.now(),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [deliveryStatus.isTracking]);

  const customerLocation = latitude && longitude ? { latitude, longitude } : null;

  const getStatusIcon = (step: typeof deliveryStatus.steps[0], isActive: boolean) => {
    if (step.completed) {
      return <CheckCircle className="w-6 h-6 text-primary" />;
    }
    if (isActive) {
      return (
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <Circle className="w-6 h-6 text-primary" />
        </motion.div>
      );
    }
    return <Circle className="w-6 h-6 text-muted-foreground" />;
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      // Send a test notification
      sendNotification(notificationTemplates.deliveryNearby(deliveryStatus.expectedTime));
    }
  };

  const handleCallMilkman = () => {
    window.location.href = `tel:${deliveryStatus.milkman.phone.replace(/\s/g, '')}`;
  };

  const handleReportIssue = () => {
    toast.info('Report submitted', { 
      description: 'Our team will contact you shortly' 
    });
  };

  const handleRefreshLocation = () => {
    // In production, this would fetch latest location from backend
    setMilkmanLocation(prev => ({
      ...prev,
      timestamp: Date.now(),
    }));
    toast.success('Location refreshed');
  };

  return (
    <MobileLayout
      header={
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-accent rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Live Tracking</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={notificationsEnabled ? undefined : handleEnableNotifications}
          >
            {notificationsEnabled ? (
              <Bell className="w-5 h-5 text-primary" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
        </div>
      }
    >
      <div className="px-5 py-4 space-y-5">
        {/* Notification Banner */}
        {!notificationsEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-3 flex items-center gap-3">
                <BellOff className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Enable notifications</p>
                  <p className="text-xs text-muted-foreground">Get alerts when your delivery is nearby</p>
                </div>
                <Button size="sm" variant="fresh" onClick={handleEnableNotifications}>
                  Enable
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Today's Delivery Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-600">Live Tracking Active</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">Today's Delivery</h2>
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </motion.div>

        {/* Live Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <LiveLocationMap
            milkmanLocation={milkmanLocation}
            customerLocation={customerLocation}
            isTracking={deliveryStatus.isTracking}
            onRefresh={handleRefreshLocation}
            estimatedArrival={deliveryStatus.expectedTime}
            milkmanName={deliveryStatus.milkman.name}
          />
        </motion.div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-semibold mb-4">Delivery Progress</p>
              <div className="space-y-0">
                {deliveryStatus.steps.map((step, index) => {
                  const isActive = !step.completed && deliveryStatus.steps[index - 1]?.completed;
                  const isLast = index === deliveryStatus.steps.length - 1;
                  
                  return (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(step, isActive)}
                        {!isLast && (
                          <div className={`w-0.5 h-10 ${step.completed ? 'bg-primary' : 'bg-border'}`} />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className={`font-medium ${step.completed || isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.time || (isActive ? `Expected: ${deliveryStatus.expectedTime}` : 'Pending')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Milkman Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="fresh">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">🧑‍🌾</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{deliveryStatus.milkman.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> ETA: {deliveryStatus.expectedTime}
                  </p>
                </div>
                <Button variant="soft" size="icon" onClick={handleCallMilkman}>
                  <Phone className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => {
              if (milkmanLocation) {
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${milkmanLocation.latitude},${milkmanLocation.longitude}`,
                  '_blank'
                );
              }
            }}
          >
            <Navigation className="w-5 h-5 mr-2" />
            View on Google Maps
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg" 
            className="w-full text-muted-foreground"
            onClick={handleReportIssue}
          >
            <AlertCircle className="w-5 h-5 mr-2" />
            Report an Issue
          </Button>
        </motion.div>
      </div>
    </MobileLayout>
  );
};
