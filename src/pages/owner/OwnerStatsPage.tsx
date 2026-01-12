import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { 
  TrendingUp, TrendingDown, Users, Droplets, IndianRupee,
  Calendar, ChevronLeft, ChevronRight, BarChart3, PieChart,
  Package, UserCheck, UserX, Milk
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const OwnerStatsPage: React.FC = () => {
  const { customers, milkProducts, milkBrands } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  const monthName = currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const today = new Date();
  const todayDayOfWeek = today.getDay();

  // Calculate stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.subscription?.isActive).length;
  const newCustomers = customers.filter(c => c.isNewUser).length;
  
  // Calculate today's inventory requirements
  const todayInventory = useMemo(() => {
    const inventory: Record<string, { brandName: string; milkName: string; liters: number; customers: number; icon: string }> = {};
    
    customers.forEach(customer => {
      if (!customer.subscription?.isActive) return;
      
      // Check if delivery is scheduled for today
      if (!customer.subscription.daysOfWeek.includes(todayDayOfWeek)) return;
      
      const product = milkProducts.find(p => p.id === customer.subscription?.milkProductId);
      if (!product) return;
      
      const brand = milkBrands.find(b => b.id === product.brandId);
      const key = product.id;
      
      if (!inventory[key]) {
        inventory[key] = {
          brandName: brand?.name || 'Unknown',
          milkName: product.name,
          liters: 0,
          customers: 0,
          icon: product.icon,
        };
      }
      
      inventory[key].liters += customer.subscription.quantityPerDelivery;
      inventory[key].customers += 1;
    });
    
    return Object.values(inventory).sort((a, b) => b.liters - a.liters);
  }, [customers, milkProducts, milkBrands, todayDayOfWeek]);

  const totalTodayLiters = todayInventory.reduce((sum, item) => sum + item.liters, 0);
  const totalTodayCustomers = todayInventory.reduce((sum, item) => sum + item.customers, 0);

  // Calculate tomorrow's inventory
  const tomorrowDayOfWeek = (todayDayOfWeek + 1) % 7;
  const tomorrowInventory = useMemo(() => {
    const inventory: Record<string, { brandName: string; milkName: string; liters: number; customers: number; icon: string }> = {};
    
    customers.forEach(customer => {
      if (!customer.subscription?.isActive) return;
      if (!customer.subscription.daysOfWeek.includes(tomorrowDayOfWeek)) return;
      
      const product = milkProducts.find(p => p.id === customer.subscription?.milkProductId);
      if (!product) return;
      
      const brand = milkBrands.find(b => b.id === product.brandId);
      const key = product.id;
      
      if (!inventory[key]) {
        inventory[key] = {
          brandName: brand?.name || 'Unknown',
          milkName: product.name,
          liters: 0,
          customers: 0,
          icon: product.icon,
        };
      }
      
      inventory[key].liters += customer.subscription.quantityPerDelivery;
      inventory[key].customers += 1;
    });
    
    return Object.values(inventory).sort((a, b) => b.liters - a.liters);
  }, [customers, milkProducts, milkBrands, tomorrowDayOfWeek]);
  
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

  const StatCard = ({ icon: Icon, label, value, subValue, trend, iconColor }: {
    icon: typeof TrendingUp;
    label: string;
    value: string;
    subValue?: string;
    trend?: 'up' | 'down';
    iconColor?: string;
  }) => (
    <Card variant="fresh" className="p-4">
      <div className="flex items-start justify-between mb-2">
        <Icon className={`w-5 h-5 ${iconColor || 'text-primary'}`} />
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

  const InventoryCard = ({ title, data, totalLiters, totalCustomers }: {
    title: string;
    data: typeof todayInventory;
    totalLiters: number;
    totalCustomers: number;
  }) => (
    <Card variant="fresh">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            {title}
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {totalLiters}L • {totalCustomers} customers
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No deliveries scheduled</p>
        ) : (
          data.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-accent/50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-sm">{item.milkName}</p>
                  <p className="text-xs text-muted-foreground">{item.brandName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{item.liters}L</p>
                <p className="text-xs text-muted-foreground">{item.customers} orders</p>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
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

      <div className="px-5 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="inventory" className="flex-1">Inventory</TabsTrigger>
            <TabsTrigger value="customers" className="flex-1">Customers</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-5">
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
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-5">
            {/* Today's Inventory */}
            <InventoryCard 
              title="Today's Requirements"
              data={todayInventory}
              totalLiters={totalTodayLiters}
              totalCustomers={totalTodayCustomers}
            />

            {/* Tomorrow's Inventory */}
            <InventoryCard 
              title="Tomorrow's Requirements"
              data={tomorrowInventory}
              totalLiters={tomorrowInventory.reduce((sum, item) => sum + item.liters, 0)}
              totalCustomers={tomorrowInventory.reduce((sum, item) => sum + item.customers, 0)}
            />

            {/* Milk Type Breakdown */}
            <Card variant="fresh">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-primary" />
                  Monthly Milk Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {milkTypeStats.slice(0, 5).map((product, index) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{product.icon}</span>
                        <span className="font-medium text-sm">{product.name}</span>
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
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-5">
            {/* Customer Stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard 
                icon={UserCheck} 
                label="Active" 
                value={String(activeCustomers)}
                iconColor="text-emerald-600"
              />
              <StatCard 
                icon={UserX} 
                label="Inactive" 
                value={String(totalCustomers - activeCustomers)}
                iconColor="text-red-500"
              />
              <StatCard 
                icon={Users} 
                label="New This Month" 
                value={String(newCustomers)}
                iconColor="text-blue-600"
              />
              <StatCard 
                icon={Milk} 
                label="Avg Order" 
                value={`${(totalMonthlyLiters / totalCustomers / daysInMonth).toFixed(1)}L`}
                subValue="Per customer/day"
              />
            </div>

            {/* Customer Growth */}
            <Card variant="fresh">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Customer Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-xl">
                  <span className="text-sm text-muted-foreground">Daily Deliveries</span>
                  <span className="font-bold">{activeCustomers}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-xl">
                  <span className="text-sm text-muted-foreground">Weekdays Only</span>
                  <span className="font-bold">{customers.filter(c => c.subscription?.daysOfWeek.length === 6).length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-xl">
                  <span className="text-sm text-muted-foreground">Custom Schedule</span>
                  <span className="font-bold">{customers.filter(c => c.subscription?.daysOfWeek.length && c.subscription.daysOfWeek.length < 6).length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-xl">
                  <span className="text-sm text-muted-foreground">High Volume (3L+)</span>
                  <span className="font-bold">{customers.filter(c => (c.subscription?.quantityPerDelivery || 0) >= 3).length}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </MobileLayout>
  );
};