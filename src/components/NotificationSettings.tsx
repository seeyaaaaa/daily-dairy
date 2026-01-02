import React from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, MessageSquare, Truck, Receipt, Calendar } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { toast } from 'sonner';

interface NotificationPreferences {
  deliveryUpdates: boolean;
  billReminders: boolean;
  subscriptionChanges: boolean;
  promotions: boolean;
}

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  onPreferencesChange: (prefs: NotificationPreferences) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  preferences,
  onPreferencesChange,
}) => {
  const { enabled, supported, requestPermission, sendNotification } = usePushNotifications();

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      sendNotification({
        title: '🔔 Notifications Enabled',
        body: 'You will now receive updates about your milk deliveries!',
      });
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    if (!enabled) {
      toast.error('Enable notifications first', {
        description: 'Please enable push notifications to receive updates',
      });
      return;
    }
    
    onPreferencesChange({
      ...preferences,
      [key]: !preferences[key],
    });
  };

  const notificationOptions = [
    {
      id: 'deliveryUpdates' as const,
      icon: Truck,
      title: 'Delivery Updates',
      description: 'Real-time tracking & delivery confirmations',
    },
    {
      id: 'billReminders' as const,
      icon: Receipt,
      title: 'Bill Reminders',
      description: 'Monthly bills & payment reminders',
    },
    {
      id: 'subscriptionChanges' as const,
      icon: Calendar,
      title: 'Subscription Changes',
      description: 'Pause, resume & modification alerts',
    },
    {
      id: 'promotions' as const,
      icon: MessageSquare,
      title: 'Offers & Updates',
      description: 'Special offers & new products',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Enable/Disable Master Toggle */}
      {!enabled && supported && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="fresh" className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <BellOff className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Notifications Disabled</p>
                  <p className="text-sm text-muted-foreground">Enable to receive delivery updates</p>
                </div>
              </div>
              <Button 
                variant="fresh" 
                className="w-full mt-4"
                onClick={handleEnableNotifications}
              >
                <Bell className="w-4 h-4 mr-2" />
                Enable Notifications
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!supported && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800">
              Push notifications are not supported in your browser. You'll still receive in-app alerts.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notification Categories */}
      <div className="space-y-3">
        {notificationOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="interactive" className={!enabled ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <option.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{option.title}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                  <Switch
                    checked={preferences[option.id]}
                    onCheckedChange={() => handleToggle(option.id)}
                    disabled={!enabled}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {enabled && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-center text-muted-foreground"
        >
          You can manage notification permissions in your browser settings
        </motion.p>
      )}
    </div>
  );
};
