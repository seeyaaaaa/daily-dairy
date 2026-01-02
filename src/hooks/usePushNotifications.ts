import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface NotificationState {
  permission: NotificationPermission | null;
  supported: boolean;
  enabled: boolean;
}

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<NotificationState>({
    permission: null,
    supported: false,
    enabled: false,
  });

  useEffect(() => {
    const supported = 'Notification' in window;
    setState({
      permission: supported ? Notification.permission : null,
      supported,
      enabled: supported && Notification.permission === 'granted',
    });
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.supported) {
      toast.error('Notifications not supported', {
        description: 'Your browser does not support push notifications',
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({
        ...prev,
        permission,
        enabled: permission === 'granted',
      }));

      if (permission === 'granted') {
        toast.success('Notifications enabled!', {
          description: 'You will receive delivery updates',
        });
        return true;
      } else if (permission === 'denied') {
        toast.error('Notifications blocked', {
          description: 'Please enable notifications in your browser settings',
        });
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [state.supported]);

  const sendNotification = useCallback((options: NotificationOptions) => {
    if (!state.enabled) {
      console.log('Notifications not enabled, showing toast instead');
      toast.info(options.title, { description: options.body });
      return;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        badge: options.badge,
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.info(options.title, { description: options.body });
    }
  }, [state.enabled]);

  const scheduleNotification = useCallback((options: NotificationOptions, delayMs: number) => {
    return setTimeout(() => {
      sendNotification(options);
    }, delayMs);
  }, [sendNotification]);

  return {
    ...state,
    requestPermission,
    sendNotification,
    scheduleNotification,
  };
};

// Predefined notification templates for MilkMate
export const notificationTemplates = {
  deliveryStarted: (milkmanName: string) => ({
    title: '🚚 Delivery Started',
    body: `${milkmanName} has started the delivery route. Your milk is on the way!`,
    tag: 'delivery-started',
  }),
  
  deliveryNearby: (estimatedTime: string) => ({
    title: '📍 Delivery Nearby',
    body: `Your milkman is nearby! Expected arrival: ${estimatedTime}`,
    tag: 'delivery-nearby',
  }),
  
  delivered: (quantity: string, milkType: string) => ({
    title: '✅ Milk Delivered',
    body: `${quantity}L ${milkType} has been delivered. Enjoy your fresh milk!`,
    tag: 'delivered',
  }),
  
  missedDelivery: () => ({
    title: '⚠️ Delivery Missed',
    body: 'Your delivery was missed today. Contact us for assistance.',
    tag: 'missed',
  }),
  
  billGenerated: (amount: string, month: string) => ({
    title: '📄 Bill Generated',
    body: `Your ${month} bill of ₹${amount} is ready. Tap to view details.`,
    tag: 'bill',
  }),
  
  paymentReceived: (amount: string) => ({
    title: '💰 Payment Received',
    body: `Payment of ₹${amount} received. Thank you!`,
    tag: 'payment',
  }),
  
  subscriptionPaused: () => ({
    title: '⏸️ Subscription Paused',
    body: 'Your milk subscription has been paused. Resume anytime!',
    tag: 'subscription',
  }),
  
  subscriptionResumed: () => ({
    title: '▶️ Subscription Resumed',
    body: 'Your milk subscription is now active. Deliveries will resume!',
    tag: 'subscription',
  }),
};
