import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { 
  TrendingUp, TrendingDown, Users, Droplets, IndianRupee,
  Calendar, ChevronLeft, ChevronRight, BarChart3, PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const OwnerStatsPage: React.FC = () => {
  const { customers, milkProducts } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthName = currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  // Calculate stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.subscription?.isActive).length;
  
  const milkTypeStats = milkProducts.map(product => {
    const customerCount = customers.filter(c => c.subscription?.milkProductId === product.id).length;
    const totalLiters = customers
      .filter(c => c.subscription?.milkProductId === product.id)
      .reduce((sum, c) => sum + (c.subscription?.quantityPerDelivery || 0) * daysInMonth, 0);
    const revenue = totalLiters * product.pricePerLiter;
    return {
      ...product,
      customerCount,
      totalLiters,
      revenue,
      percentage: Math.round((customerCount / totalCustomers) * 100) || 0,
    };
  }).sort((a, b) => b.customerCount - a.customerCount);

  const totalMonthlyLiters = milkTypeStats.reduce((sum, m) => sum + m.totalLiters, 0);
  const totalMonthlyRevenue = milkTypeStats.reduce((sum, m) => sum + m.revenue, 0);
  const avgDailyLiters = Math.round(totalMonthlyLiters / daysInMonth);
  const avgDailyRevenue = Math.round(totalMonthlyRevenue / daysInMonth);

  // Mock weekly data
  const weeklyData = [
    { day: 'Mon', liters: 12, revenue: 780 },
    { day: 'Tue', liters: 11.5, revenue: 750 },
    { day: 'Wed', liters: 13, revenue: 820 },
    { day: 'Thu', liters: 12.5, revenue: 800 },
    { day: 'Fri', liters: 11, revenue: 720 },
    { day: 'Sat', liters: 10.5, revenue: 700 },
    { day: 'Sun', liters: 9, revenue: 580 },
  ];

  const maxLiters = Math.max(...weeklyData.map(d => d.liters));

  const changeMonth = (delta: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const StatCard = ({ icon: Icon, label, value, subValue, trend }: {
    icon: typeof TrendingUp;
    label: string;
    value: string;
    subValue?: string;
    trend?: 'up' | 'down';
  }) => (
    <Card variant="fresh" className="p-4">
      <div className="flex items-start justify-between mb-2">
        <Icon className="w-5 h-5 text-primary" />
        {trend && (
          <span className={`text-xs flex items-center ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {trend === 'up' ? '+12%' : '-5%'}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
    </Card>
  );

  return (
    <MobileLayout isOwner>
      <div className="px-5 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          
          {/* Month Selector */}
          <div className="flex items-center justify-between mt-3">
            <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="font-medium">{monthName}</span>
            <Button variant="ghost" size="icon" onClick={() => changeMonth(1)}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="px-5 space-y-5 pb-24">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard 
            icon={Users} 
            label="Total Customers" 
            value={String(totalCustomers)}
            subValue={`${activeCustomers} active`}
            trend="up"
          />
          <StatCard 
            icon={Droplets} 
            label="Monthly Milk" 
            value={`${totalMonthlyLiters}L`}
            subValue={`~${avgDailyLiters}L/day`}
            trend="up"
          />
          <StatCard 
            icon={IndianRupee} 
            label="Monthly Revenue" 
            value={`₹${totalMonthlyRevenue.toLocaleString()}`}
            subValue={`~₹${avgDailyRevenue}/day`}
            trend="up"
          />
          <StatCard 
            icon={Calendar} 
            label="Delivery Days" 
            value={String(daysInMonth)}
            subValue="This month"
          />
        </div>

        {/* Weekly Chart */}
        <Card variant="fresh">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              This Week's Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-32 gap-2">
              {weeklyData.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div 
                    className="w-full bg-primary/80 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.liters / maxLiters) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  />
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t text-sm">
              <span className="text-muted-foreground">Total: {weeklyData.reduce((s, d) => s + d.liters, 0)}L</span>
              <span className="font-medium text-primary">₹{weeklyData.reduce((s, d) => s + d.revenue, 0)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Milk Type Breakdown */}
        <Card variant="fresh">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" />
              Milk Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {milkTypeStats.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{product.icon}</span>
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.customerCount} customers
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${product.percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{product.totalLiters}L/month</span>
                  <span>₹{product.revenue.toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <Card variant="fresh">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-800">Best Selling</p>
                <p className="text-sm text-emerald-600">
                  {milkTypeStats[0]?.name} ({milkTypeStats[0]?.percentage}% of orders)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">Busiest Day</p>
                <p className="text-sm text-amber-600">
                  Wednesday (avg 13L delivered)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Customer Retention</p>
                <p className="text-sm text-blue-600">
                  98% active this month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </MobileLayout>
  );
};
