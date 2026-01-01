import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { 
  Phone, MapPin, Edit2, Pause, Play, UserPlus, Search,
  ChevronRight, Droplets, Calendar, MoreVertical, Trash2, Users
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const OwnerCustomersPage: React.FC = () => {
  const { customers, setCustomers, milkProducts } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [pausedCustomers, setPausedCustomers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('active');

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    flat: '',
    building: '',
  });

  const activeCustomers = customers.filter(c => 
    !pausedCustomers.includes(c.id) && 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const pausedCustomersList = customers.filter(c => 
    pausedCustomers.includes(c.id) && 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTogglePause = (customerId: string) => {
    if (pausedCustomers.includes(customerId)) {
      setPausedCustomers(prev => prev.filter(id => id !== customerId));
      toast.success('Customer subscription resumed');
    } else {
      setPausedCustomers(prev => [...prev, customerId]);
      toast.success('Customer subscription paused');
    }
  };

  const handleCallCustomer = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newId = `c${Date.now()}`;
    const customer = {
      id: newId,
      userId: newId,
      name: newCustomer.name,
      phone: newCustomer.phone,
      addressId: newId,
      subscription: {
        id: `s${newId}`,
        customerId: newId,
        addressId: newId,
        milkProductId: '1',
        quantityPerDelivery: 1,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        startDate: new Date().toISOString().split('T')[0],
        isActive: true,
      },
    };

    setCustomers([...customers, customer]);
    setShowAddCustomer(false);
    setNewCustomer({ name: '', phone: '', flat: '', building: '' });
    toast.success('Customer added successfully!');
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId));
    toast.success('Customer removed');
  };

  const CustomerCard = ({ customer, index, isPaused }: { customer: typeof customers[0], index: number, isPaused: boolean }) => {
    const milk = milkProducts.find(m => m.id === customer.subscription?.milkProductId);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        layout
      >
        <Card 
          variant="interactive"
          className={isPaused ? 'opacity-60' : ''}
          onClick={() => setSelectedCustomer(customer)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center text-lg">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{customer.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> A-{101 + index}, Sunrise Towers
                  </p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCallCustomer(customer.phone); }}>
                    <Phone className="w-4 h-4 mr-2" /> Call
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedCustomer(customer); }}>
                    <Edit2 className="w-4 h-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleTogglePause(customer.id); }}>
                    {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={(e) => { e.stopPropagation(); handleDeleteCustomer(customer.id); }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-3 pt-3 border-t flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Droplets className="w-3.5 h-3.5" /> {customer.subscription?.quantityPerDelivery}L
                </span>
                <span className="text-muted-foreground">{milk?.name}</span>
              </div>
              {isPaused && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                  Paused
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <MobileLayout isOwner>
      <div className="px-5 pt-6 pb-4">
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Customers</h1>
            <p className="text-sm text-muted-foreground">{customers.length} total customers</p>
          </div>
          <Button variant="fresh" size="sm" onClick={() => setShowAddCustomer(true)}>
            <UserPlus className="w-4 h-4 mr-1" /> Add
          </Button>
        </motion.div>
      </div>

      <div className="px-5 space-y-4 pb-24">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="active" className="flex-1">
              Active ({activeCustomers.length})
            </TabsTrigger>
            <TabsTrigger value="paused" className="flex-1">
              Paused ({pausedCustomersList.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3 mt-4">
            {activeCustomers.map((customer, index) => (
              <CustomerCard 
                key={customer.id} 
                customer={customer} 
                index={index}
                isPaused={false}
              />
            ))}
            {activeCustomers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground">No active customers found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="paused" className="space-y-3 mt-4">
            {pausedCustomersList.map((customer, index) => (
              <CustomerCard 
                key={customer.id} 
                customer={customer} 
                index={index}
                isPaused={true}
              />
            ))}
            {pausedCustomersList.length === 0 && (
              <div className="text-center py-12">
                <Pause className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground">No paused customers</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <Input 
                placeholder="Customer name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone *</label>
              <Input 
                placeholder="+91 98765 43210"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Flat/House No.</label>
              <Input 
                placeholder="A-101"
                value={newCustomer.flat}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, flat: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Building/Society</label>
              <Input 
                placeholder="Sunrise Towers"
                value={newCustomer.building}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, building: e.target.value }))}
                className="mt-1"
              />
            </div>

            <Button variant="fresh" className="w-full" onClick={handleAddCustomer}>
              <UserPlus className="w-4 h-4 mr-2" /> Add Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCustomer.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>A-{101 + customers.indexOf(selectedCustomer)}, Sunrise Towers, Andheri West</span>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Subscription Details</p>
                  <div className="space-y-2 bg-accent/50 rounded-lg p-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Milk Type</span>
                      <span className="font-medium">
                        {milkProducts.find(m => m.id === selectedCustomer.subscription?.milkProductId)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-medium">{selectedCustomer.subscription?.quantityPerDelivery}L/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Schedule</span>
                      <span className="font-medium">Daily</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Since</span>
                      <span className="font-medium">{selectedCustomer.subscription?.startDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleCallCustomer(selectedCustomer.phone)}
                  >
                    <Phone className="w-4 h-4 mr-2" /> Call
                  </Button>
                  <Button 
                    variant={pausedCustomers.includes(selectedCustomer.id) ? 'fresh' : 'outline'}
                    className="flex-1"
                    onClick={() => handleTogglePause(selectedCustomer.id)}
                  >
                    {pausedCustomers.includes(selectedCustomer.id) ? (
                      <><Play className="w-4 h-4 mr-2" /> Resume</>
                    ) : (
                      <><Pause className="w-4 h-4 mr-2" /> Pause</>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </MobileLayout>
  );
};
