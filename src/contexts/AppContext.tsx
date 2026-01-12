import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'consumer' | 'owner' | null;
export type Language = 'en' | 'hi' | 'mr';
export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'card';
export type AuthMode = 'login' | 'signup';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  isNewUser?: boolean;
  dairyAddress?: string;
  dairyArea?: string;
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
  customSlotTime?: string;
  isDefault: boolean;
}

export interface MilkBrand {
  id: string;
  name: string;
  logo: string;
  description: string;
}

export interface MilkProduct {
  id: string;
  brandId: string;
  name: string;
  type: 'cow' | 'buffalo' | 'toned' | 'full_cream' | 'a2' | 'vegan' | 'almond' | 'soy' | 'oat' | 'standardised';
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
  paymentMethod: PaymentMethod;
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
  isNewUser?: boolean;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  addresses: Address[];
  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Address) => void;
  milkBrands: MilkBrand[];
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
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
}

const defaultMilkBrands: MilkBrand[] = [
  { id: 'b1', name: 'Country Delight', logo: '🥛', description: 'Farm fresh milk delivered daily' },
  { id: 'b2', name: 'Amul', logo: '🐄', description: 'The taste of India' },
  { id: 'b3', name: 'Chitale', logo: '🏆', description: 'Premium quality dairy' },
  { id: 'b4', name: 'Pride of Cows', logo: '✨', description: 'Single origin farm milk' },
  { id: 'b5', name: 'Mother Dairy', logo: '🌻', description: 'Quality you can trust' },
  { id: 'b6', name: 'Gokul', logo: '🌿', description: 'Fresh & natural' },
  { id: 'b7', name: 'Local Dairy', logo: '🏠', description: 'Local farm fresh milk' },
];

const defaultMilkProducts: MilkProduct[] = [
  // Country Delight
  { id: '1', brandId: 'b1', name: 'Cow Milk', type: 'cow', pricePerLiter: 68, description: 'Farm fresh cow milk', icon: '🐄' },
  { id: '2', brandId: 'b1', name: 'Buffalo Milk', type: 'buffalo', pricePerLiter: 78, description: 'Creamy buffalo milk', icon: '🐃' },
  { id: '3', brandId: 'b1', name: 'A2 Cow Milk', type: 'a2', pricePerLiter: 90, description: 'Pure A2 desi cow milk', icon: '🥛' },
  { id: '4', brandId: 'b1', name: 'Toned Milk', type: 'toned', pricePerLiter: 58, description: 'Low fat toned milk', icon: '🥛' },
  { id: '5', brandId: 'b1', name: 'Full Cream', type: 'full_cream', pricePerLiter: 72, description: 'Rich full cream milk', icon: '✨' },
  
  // Amul
  { id: '6', brandId: 'b2', name: 'Taaza (Toned)', type: 'toned', pricePerLiter: 54, description: 'Toned milk for daily use', icon: '🥛' },
  { id: '7', brandId: 'b2', name: 'Gold (Full Cream)', type: 'full_cream', pricePerLiter: 66, description: 'Full cream milk', icon: '✨' },
  { id: '8', brandId: 'b2', name: 'Shakti (Standardised)', type: 'standardised', pricePerLiter: 52, description: 'Standardised milk', icon: '💪' },
  { id: '9', brandId: 'b2', name: 'Buffalo Milk', type: 'buffalo', pricePerLiter: 70, description: 'Pure buffalo milk', icon: '🐃' },
  { id: '10', brandId: 'b2', name: 'Cow Milk', type: 'cow', pricePerLiter: 62, description: 'Fresh cow milk', icon: '🐄' },
  
  // Chitale
  { id: '11', brandId: 'b3', name: 'Full Cream', type: 'full_cream', pricePerLiter: 72, description: 'Premium full cream', icon: '🥛' },
  { id: '12', brandId: 'b3', name: 'Toned Milk', type: 'toned', pricePerLiter: 60, description: 'Light toned milk', icon: '🥛' },
  { id: '13', brandId: 'b3', name: 'Cow Milk', type: 'cow', pricePerLiter: 68, description: 'Pure cow milk', icon: '🐄' },
  { id: '14', brandId: 'b3', name: 'Buffalo Milk', type: 'buffalo', pricePerLiter: 76, description: 'Rich buffalo milk', icon: '🐃' },
  
  // Pride of Cows
  { id: '15', brandId: 'b4', name: 'Farm Fresh Cow', type: 'cow', pricePerLiter: 95, description: 'Single origin premium cow milk', icon: '✨' },
  { id: '16', brandId: 'b4', name: 'A2 Milk', type: 'a2', pricePerLiter: 110, description: 'Premium A2 protein milk', icon: '🥛' },
  { id: '17', brandId: 'b4', name: 'Full Cream', type: 'full_cream', pricePerLiter: 100, description: 'Ultra premium full cream', icon: '✨' },
  
  // Mother Dairy
  { id: '18', brandId: 'b5', name: 'Cow Milk', type: 'cow', pricePerLiter: 60, description: 'Fresh cow milk', icon: '🐄' },
  { id: '19', brandId: 'b5', name: 'Buffalo Milk', type: 'buffalo', pricePerLiter: 72, description: 'Pure buffalo milk', icon: '🐃' },
  { id: '20', brandId: 'b5', name: 'Toned Milk', type: 'toned', pricePerLiter: 52, description: 'Double toned milk', icon: '🥛' },
  { id: '21', brandId: 'b5', name: 'Full Cream', type: 'full_cream', pricePerLiter: 64, description: 'Full cream milk', icon: '✨' },
  
  // Gokul
  { id: '22', brandId: 'b6', name: 'Cow Milk', type: 'cow', pricePerLiter: 58, description: 'Fresh cow milk', icon: '🐄' },
  { id: '23', brandId: 'b6', name: 'Buffalo Milk', type: 'buffalo', pricePerLiter: 68, description: 'Fresh buffalo milk', icon: '🐃' },
  { id: '24', brandId: 'b6', name: 'Toned Milk', type: 'toned', pricePerLiter: 50, description: 'Toned milk', icon: '🥛' },
  
  // Local Dairy - includes vegan options
  { id: '25', brandId: 'b7', name: 'Cow Milk', type: 'cow', pricePerLiter: 60, description: 'Fresh A2 cow milk', icon: '🐄' },
  { id: '26', brandId: 'b7', name: 'Buffalo Milk', type: 'buffalo', pricePerLiter: 70, description: 'Creamy buffalo milk', icon: '🐃' },
  { id: '27', brandId: 'b7', name: 'Toned Milk', type: 'toned', pricePerLiter: 55, description: 'Low fat milk', icon: '🥛' },
  { id: '28', brandId: 'b7', name: 'Full Cream', type: 'full_cream', pricePerLiter: 65, description: 'Rich full cream', icon: '✨' },
  { id: '29', brandId: 'b7', name: 'Almond Milk', type: 'almond', pricePerLiter: 120, description: 'Plant-based almond milk', icon: '🥜' },
  { id: '30', brandId: 'b7', name: 'Soy Milk', type: 'soy', pricePerLiter: 90, description: 'Protein-rich soy milk', icon: '🫘' },
  { id: '31', brandId: 'b7', name: 'Oat Milk', type: 'oat', pricePerLiter: 110, description: 'Creamy oat milk', icon: '🌾' },
];

const defaultCustomers: Customer[] = [
  { id: 'c1', userId: 'u1', name: 'Riya Sharma', phone: '+91 98765 43210', addressId: 'a1', isNewUser: false, subscription: { id: 's1', customerId: 'c1', addressId: 'a1', milkProductId: '1', quantityPerDelivery: 1, daysOfWeek: [0,1,2,3,4,5,6], startDate: '2024-01-01', isActive: true, paymentMethod: 'cash' } },
  { id: 'c2', userId: 'u2', name: 'Aditya Patel', phone: '+91 98765 43211', addressId: 'a2', isNewUser: false, subscription: { id: 's2', customerId: 'c2', addressId: 'a2', milkProductId: '7', quantityPerDelivery: 1.5, daysOfWeek: [1,2,3,4,5,6], startDate: '2024-01-01', isActive: true, paymentMethod: 'upi' } },
  { id: 'c3', userId: 'u3', name: 'Priya Singh', phone: '+91 98765 43212', addressId: 'a3', isNewUser: false, subscription: { id: 's3', customerId: 'c3', addressId: 'a3', milkProductId: '15', quantityPerDelivery: 2, daysOfWeek: [0,1,2,3,4,5,6], startDate: '2024-01-01', isActive: true, paymentMethod: 'bank_transfer' } },
  { id: 'c4', userId: 'u4', name: 'Rahul Kumar', phone: '+91 98765 43213', addressId: 'a4', isNewUser: false, subscription: { id: 's4', customerId: 'c4', addressId: 'a4', milkProductId: '6', quantityPerDelivery: 0.5, daysOfWeek: [0,1,2,3,4,5,6], startDate: '2024-01-01', isActive: true, paymentMethod: 'cash' } },
  { id: 'c5', userId: 'u5', name: 'Sneha Gupta', phone: '+91 98765 43214', addressId: 'a5', isNewUser: false, subscription: { id: 's5', customerId: 'c5', addressId: 'a5', milkProductId: '11', quantityPerDelivery: 1, daysOfWeek: [1,2,3,4,5], startDate: '2024-01-01', isActive: true, paymentMethod: 'upi' } },
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
  const [authMode, setAuthMode] = useState<AuthMode>('signup');

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
      milkBrands: defaultMilkBrands,
      milkProducts: defaultMilkProducts,
      subscriptions, setSubscriptions, addSubscription, updateSubscription,
      dailyOverrides, addDailyOverride,
      deliveries, setDeliveries, updateDelivery,
      customers, setCustomers,
      isOnboarded, setIsOnboarded,
      authMode, setAuthMode,
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
