import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'consumer' | 'owner' | null;
export type Language = 'en' | 'hi' | 'mr';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
}

export interface Address {
  id: string;
  flat: string;
  building: string;
  area: string;
  landmark: string;
  pincode: string;
  city: string;
  deliverySlot: string;
  isDefault: boolean;
}

export interface MilkProduct {
  id: string;
  name: string;
  pricePerLiter: number;
  description: string;
  icon: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  addressId: string;
  milkProductId: string;
  quantityPerDelivery: number;
  daysOfWeek: number[];
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface DailyOverride {
  id: string;
  subscriptionId: string;
  date: string;
  quantityOverride?: number;
  isPaused: boolean;
}

export interface Delivery {
  id: string;
  customerId: string;
  date: string;
  milkProductId: string;
  quantityDelivered: number;
  pricePerLiter: number;
  totalAmount: number;
  status: 'pending' | 'out_for_delivery' | 'delivered' | 'missed';
  deliveredAt?: string;
}

export interface Customer {
  id: string;
  userId: string;
  name: string;
  phone: string;
  addressId: string;
  subscription?: Subscription;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  addresses: Address[];
  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Address) => void;
  milkProducts: MilkProduct[];
  subscriptions: Subscription[];
  setSubscriptions: (subs: Subscription[]) => void;
  addSubscription: (sub: Subscription) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  dailyOverrides: DailyOverride[];
  addDailyOverride: (override: DailyOverride) => void;
  deliveries: Delivery[];
  setDeliveries: (deliveries: Delivery[]) => void;
  updateDelivery: (id: string, updates: Partial<Delivery>) => void;
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
}

const defaultMilkProducts: MilkProduct[] = [
  { id: '1', name: 'Cow Milk', pricePerLiter: 60, description: 'Fresh A2 cow milk, rich in nutrients', icon: '🐄' },
  { id: '2', name: 'Buffalo Milk', pricePerLiter: 70, description: 'Creamy buffalo milk, high fat content', icon: '🐃' },
  { id: '3', name: 'Toned Milk', pricePerLiter: 55, description: 'Low fat milk for health conscious', icon: '🥛' },
  { id: '4', name: 'Full Cream', pricePerLiter: 65, description: 'Rich full cream milk', icon: '✨' },
];

const defaultCustomers: Customer[] = [
  { id: 'c1', userId: 'u1', name: 'Riya Sharma', phone: '+91 98765 43210', addressId: 'a1', subscription: { id: 's1', customerId: 'c1', addressId: 'a1', milkProductId: '1', quantityPerDelivery: 1, daysOfWeek: [0,1,2,3,4,5,6], startDate: '2024-01-01', isActive: true } },
  { id: 'c2', userId: 'u2', name: 'Aditya Patel', phone: '+91 98765 43211', addressId: 'a2', subscription: { id: 's2', customerId: 'c2', addressId: 'a2', milkProductId: '2', quantityPerDelivery: 1.5, daysOfWeek: [1,2,3,4,5,6], startDate: '2024-01-01', isActive: true } },
  { id: 'c3', userId: 'u3', name: 'Priya Singh', phone: '+91 98765 43212', addressId: 'a3', subscription: { id: 's3', customerId: 'c3', addressId: 'a3', milkProductId: '1', quantityPerDelivery: 2, daysOfWeek: [0,1,2,3,4,5,6], startDate: '2024-01-01', isActive: true } },
  { id: 'c4', userId: 'u4', name: 'Rahul Kumar', phone: '+91 98765 43213', addressId: 'a4', subscription: { id: 's4', customerId: 'c4', addressId: 'a4', milkProductId: '3', quantityPerDelivery: 0.5, daysOfWeek: [0,1,2,3,4,5,6], startDate: '2024-01-01', isActive: true } },
  { id: 'c5', userId: 'u5', name: 'Sneha Gupta', phone: '+91 98765 43214', addressId: 'a5', subscription: { id: 's5', customerId: 'c5', addressId: 'a5', milkProductId: '2', quantityPerDelivery: 1, daysOfWeek: [1,2,3,4,5], startDate: '2024-01-01', isActive: true } },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [dailyOverrides, setDailyOverrides] = useState<DailyOverride[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(defaultCustomers);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const addAddress = (address: Address) => {
    setAddresses(prev => [...prev, address]);
  };

  const addSubscription = (sub: Subscription) => {
    setSubscriptions(prev => [...prev, sub]);
  };

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addDailyOverride = (override: DailyOverride) => {
    setDailyOverrides(prev => {
      const existing = prev.findIndex(o => o.subscriptionId === override.subscriptionId && o.date === override.date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = override;
        return updated;
      }
      return [...prev, override];
    });
  };

  const updateDelivery = (id: string, updates: Partial<Delivery>) => {
    setDeliveries(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      language, setLanguage,
      addresses, setAddresses, addAddress,
      milkProducts: defaultMilkProducts,
      subscriptions, setSubscriptions, addSubscription, updateSubscription,
      dailyOverrides, addDailyOverride,
      deliveries, setDeliveries, updateDelivery,
      customers, setCustomers,
      isOnboarded, setIsOnboarded,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
