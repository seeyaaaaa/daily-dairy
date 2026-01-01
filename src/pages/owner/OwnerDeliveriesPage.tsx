import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { 
  Check, Phone, MapPin, Navigation, Plus, Minus, 
  Clock, Filter, Search, ChevronDown, X, Truck
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export const OwnerDeliveriesPage: React.FC = () => {
  const { customers, milkProducts } = useApp();
  const [deliveredIds, setDeliveredIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'delivered'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [extraQuantity, setExtraQuantity] = useState<Record<string, number>>({});

  const today = new Date();

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isDelivered = deliveredIds.includes(customer.id);
    
    if (selectedFilter === 'pending') return matchesSearch && !isDelivered;
    if (selectedFilter === 'delivered') return matchesSearch && isDelivered;
    return matchesSearch;
  });

  const pendingCount = customers.filter(c => !deliveredIds.includes(c.id)).length;
  const deliveredCount = deliveredIds.length;

  const handleMarkDelivered = (customerId: string) => {
    setDeliveredIds(prev => [...prev, customerId]);
    setSelectedCustomer(null);
    toast.success('Marked as delivered!', {
      description: 'Delivery recorded successfully'
    });
  };

  const handleUndoDelivery = (customerId: string) => {
    setDeliveredIds(prev => prev.filter(id => id !== customerId));
    toast.info('Delivery status reverted');
  };

  const handleMarkAllDelivered = () => {
    const pendingIds = customers.filter(c => !deliveredIds.includes(c.id)).map(c => c.id);
    setDeliveredIds(prev => [...prev, ...pendingIds]);
    toast.success(`Marked ${pendingIds.length} deliveries as completed!`);
  };

  const handleCallCustomer = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`;
  };

  const handleNavigate = (address: string) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`, '_blank');
  };

  const adjustExtra = (customerId: string, delta: number) => {
    setExtraQuantity(prev => ({
      ...prev,
      [customerId]: Math.max(0, (prev[customerId] || 0) + delta)
    }));
  };

  return (
    <MobileLayout isOwner>
      <div className="px-5 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm text-muted-foreground">
            {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-2xl font-bold text-foreground">Deliveries</h1>
        </motion.div>
      </div>

      <div className="px-5 space-y-4 pb-24">
        {/* Search and Filter Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-primary/10 border-primary' : ''}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter Chips */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 overflow-x-auto pb-1"
            >
              {[
                { id: 'all', label: `All (${customers.length})` },
                { id: 'pending', label: `Pending (${pendingCount})` },
                { id: 'delivered', label: `Delivered (${deliveredCount})` },
              ].map(filter => (
                <Button
                  key={filter.id}
                  variant={selectedFilter === filter.id ? 'fresh' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.id as typeof selectedFilter)}
                  className="whitespace-nowrap"
                >
                  {filter.label}
                </Button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <Card variant="fresh" className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Today's Progress</span>
            <span className="text-sm text-muted-foreground">
              {deliveredCount}/{customers.length} completed
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(deliveredCount / customers.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {pendingCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-3 w-full text-primary"
              onClick={handleMarkAllDelivered}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark all {pendingCount} as delivered
            </Button>
          )}
        </Card>

        {/* Delivery List */}
        <div className="space-y-3">
          {filteredCustomers.map((customer, index) => {
            const milk = milkProducts.find(m => m.id === customer.subscription?.milkProductId);
            const isDelivered = deliveredIds.includes(customer.id);
            const extra = extraQuantity[customer.id] || 0;
            const baseQty = customer.subscription?.quantityPerDelivery || 0;
            const totalQty = baseQty + extra;
            const amount = totalQty * (milk?.pricePerLiter || 0);

            return (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                layout
              >
                <Card 
                  variant={isDelivered ? 'default' : 'interactive'} 
                  className={`transition-all ${isDelivered ? 'opacity-60 scale-[0.98]' : ''}`}
                  onClick={() => !isDelivered && setSelectedCustomer(customer)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                          ${isDelivered ? 'bg-primary text-primary-foreground' : 'bg-accent text-primary'}`}>
                          {isDelivered ? <Check className="w-5 h-5" /> : index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{customer.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> A-{101 + index}, Sunrise Towers
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{totalQty}L</p>
                        <p className="text-xs text-muted-foreground">{milk?.name}</p>
                        {extra > 0 && (
                          <span className="text-xs text-primary">+{extra}L extra</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-primary">₹{amount}</p>
                      <div className="flex items-center gap-2">
                        {isDelivered ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => { e.stopPropagation(); handleUndoDelivery(customer.id); }}
                            className="text-muted-foreground"
                          >
                            <X className="w-4 h-4 mr-1" /> Undo
                          </Button>
                        ) : (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => { e.stopPropagation(); handleCallCustomer(customer.phone); }}
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="fresh" 
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleMarkDelivered(customer.id); }}
                            >
                              <Check className="w-4 h-4 mr-1" /> Done
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Truck className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">No deliveries found</p>
          </div>
        )}
      </div>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-left">{selectedCustomer.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>A-{101 + customers.indexOf(selectedCustomer)}, Sunrise Towers, Andheri West</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>6:00 - 7:00 AM slot</span>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Today's Order</p>
                  <div className="flex items-center justify-between bg-accent/50 rounded-lg p-3">
                    <div>
                      <p className="font-semibold">
                        {milkProducts.find(m => m.id === selectedCustomer.subscription?.milkProductId)?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₹{milkProducts.find(m => m.id === selectedCustomer.subscription?.milkProductId)?.pricePerLiter}/L
                      </p>
                    </div>
                    <p className="text-2xl font-bold">
                      {(selectedCustomer.subscription?.quantityPerDelivery || 0) + (extraQuantity[selectedCustomer.id] || 0)}L
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Add Extra Milk</p>
                  <div className="flex items-center justify-center gap-4">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => adjustExtra(selectedCustomer.id, -0.5)}
                      disabled={(extraQuantity[selectedCustomer.id] || 0) === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-2xl font-bold w-16 text-center">
                      +{extraQuantity[selectedCustomer.id] || 0}L
                    </span>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => adjustExtra(selectedCustomer.id, 0.5)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
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
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleNavigate('Sunrise Towers, Andheri West, Mumbai')}
                  >
                    <Navigation className="w-4 h-4 mr-2" /> Navigate
                  </Button>
                </div>

                <Button 
                  variant="fresh" 
                  className="w-full"
                  onClick={() => handleMarkDelivered(selectedCustomer.id)}
                >
                  <Check className="w-4 h-4 mr-2" /> Mark as Delivered
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </MobileLayout>
  );
};
