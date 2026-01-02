import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { NotificationSettings } from '@/components/NotificationSettings';
import { useApp } from '@/contexts/AppContext';
import { User, MapPin, LogOut, ChevronRight, Plus, Phone, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const AccountPage: React.FC = () => {
  const [notificationPrefs, setNotificationPrefs] = useState({
    deliveryUpdates: true,
    billReminders: true,
    subscriptionChanges: true,
    promotions: false,
  });
  const navigate = useNavigate();
  const { user, addresses, setUser, setIsOnboarded } = useApp();

  const handleLogout = () => {
    setUser(null);
    setIsOnboarded(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];

  return (
    <MobileLayout>
      {/* Header */}
      <div className="px-5 py-6 gradient-soft">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-16 h-16 rounded-2xl gradient-fresh flex items-center justify-center shadow-glow">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{user?.name || 'User'}</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {user?.phone || '+91 XXXXX XXXXX'}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="px-5 py-4 space-y-5 pb-24">
        {/* Address Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Delivery Address
            </h2>
            <Button variant="ghost" size="sm" className="text-primary -mr-2">
              <Plus className="w-4 h-4 mr-1" />
              Add New
            </Button>
          </div>
          
          {defaultAddress ? (
            <Card variant="interactive" className="p-0">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">Home</p>
                    {defaultAddress.isDefault && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {defaultAddress.flat}, {defaultAddress.building}, {defaultAddress.area}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Delivery: {defaultAddress.deliverySlot.replace('-', ':00 - ')}:00 AM
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </CardContent>
            </Card>
          ) : (
            <Card variant="fresh" className="p-4 text-center">
              <p className="text-muted-foreground mb-3">No address saved yet</p>
              <Button variant="soft" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Address
              </Button>
            </Card>
          )}
        </motion.section>

        {/* Notifications */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Notifications
          </h2>
          <NotificationSettings 
            preferences={notificationPrefs}
            onPreferencesChange={setNotificationPrefs}
          />
        </motion.section>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </motion.div>
      </div>

      <BottomNav />
    </MobileLayout>
  );
};
