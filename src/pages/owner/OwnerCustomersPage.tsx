import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { 
  Phone, MapPin, Edit2, Pause, Play, UserPlus, Search,
  ChevronRight, Droplets, MoreVertical, Trash2, Users,
  Minus, Plus, Save, Calendar, Filter, X
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const PUNE_AREAS = [
  'All Areas',
  'Kothrud',
  'Baner',
  'Wakad',
  'Hinjewadi',
  'Aundh',
  'Shivaji Nagar',
  'Deccan',
  'Viman Nagar',
  'Kalyani Nagar',
  'Magarpatta',
  'Hadapsar',
  'Kharadi',
  'Pimple Saudagar',
  'Pune Station',
  'Camp',
];

const QUANTITY_FILTERS = [
  { id: 'all', label: 'All Quantities' },
  { id: 'less_1', label: 'Less than 1L' },
  { id: '1_2', label: '1L - 2L' },
  { id: '2_3', label: '2L - 3L' },
  { id: '3_plus', label: '3L+' },
];

export const OwnerCustomersPage: React.FC = () => {
  const { customers, setCustomers, milkProducts, milkBrands } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [pausedCustomers, setPausedCustomers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('active');
  const [isEditing, setIsEditing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [areaFilter, setAreaFilter] = useState('All Areas');
  const [quantityFilter, setQuantityFilter] = useState('all');

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    flat: '',
    building: '',
    area: '',
    milkProductId: '1',
    quantityPerDelivery: 1,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6] as number[],
  });

  const [editForm, setEditForm] = useState({
    milkProductId: '',
    quantityPerDelivery: 1,
    daysOfWeek: [] as number[],
  });

  // Filter customers based on search, area, and quantity
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // Search filter
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           c.phone.includes(searchQuery);
      
      // Area filter (mock - in real app this would come from address)
      const customerArea = PUNE_AREAS[Math.floor(Math.random() * (PUNE_AREAS.length - 1)) + 1];
      const matchesArea = areaFilter === 'All Areas' || customerArea === areaFilter;
      
      // Quantity filter
      const qty = c.subscription?.quantityPerDelivery || 0;
      let matchesQuantity = true;
      switch (quantityFilter) {
        case 'less_1':
          matchesQuantity = qty < 1;
          break;
        case '1_2':
          matchesQuantity = qty >= 1 && qty < 2;
          break;
        case '2_3':
          matchesQuantity = qty >= 2 && qty < 3;
          break;
        case '3_plus':
          matchesQuantity = qty >= 3;
          break;
        default:
          matchesQuantity = true;
      }
      
      return matchesSearch && matchesArea && matchesQuantity;
    });
  }, [customers, searchQuery, areaFilter, quantityFilter]);

  const activeCustomers = filteredCustomers.filter(c => !pausedCustomers.includes(c.id));
  const pausedCustomersList = filteredCustomers.filter(c => pausedCustomers.includes(c.id));

  const activeFiltersCount = (areaFilter !== 'All Areas' ? 1 : 0) + (quantityFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setAreaFilter('All Areas');
    setQuantityFilter('all');
  };

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

  const toggleDayOfWeek = (day: number, isNew: boolean = true) => {
    if (isNew) {
      setNewCustomer(prev => ({
        ...prev,
        daysOfWeek: prev.daysOfWeek.includes(day)
          ? prev.daysOfWeek.filter(d => d !== day)
          : [...prev.daysOfWeek, day].sort((a, b) => a - b)
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        daysOfWeek: prev.daysOfWeek.includes(day)
          ? prev.daysOfWeek.filter(d => d !== day)
          : [...prev.daysOfWeek, day].sort((a, b) => a - b)
      }));
    }
  };

  const adjustQuantity = (delta: number, isNew: boolean = true) => {
    if (isNew) {
      setNewCustomer(prev => ({
        ...prev,
        quantityPerDelivery: Math.max(0.5, Math.min(5, prev.quantityPerDelivery + delta))
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        quantityPerDelivery: Math.max(0.5, Math.min(5, prev.quantityPerDelivery + delta))
      }));
    }
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (newCustomer.daysOfWeek.length === 0) {
      toast.error('Please select at least one delivery day');
      return;
    }

    const newId = `c${Date.now()}`;
    const customer = {
      id: newId,
      userId: newId,
      name: newCustomer.name,
      phone: newCustomer.phone,
      addressId: newId,
      isNewUser: true,
      subscription: {
        id: `s${newId}`,
        customerId: newId,
        addressId: newId,
        milkProductId: newCustomer.milkProductId,
        quantityPerDelivery: newCustomer.quantityPerDelivery,
        daysOfWeek: newCustomer.daysOfWeek,
        startDate: new Date().toISOString().split('T')[0],
        isActive: true,
        paymentMethod: 'cash' as const,
      },
    };

    setCustomers([...customers, customer]);
    setShowAddCustomer(false);
    setNewCustomer({ 
      name: '', 
      phone: '', 
      flat: '', 
      building: '',
      area: '',
      milkProductId: '1',
      quantityPerDelivery: 1,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    });
    toast.success('Customer added successfully!');
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId));
    toast.success('Customer removed');
  };

  const handleEditCustomer = (customer: typeof customers[0]) => {
    setSelectedCustomer(customer);
    setEditForm({
      milkProductId: customer.subscription?.milkProductId || '1',
      quantityPerDelivery: customer.subscription?.quantityPerDelivery || 1,
      daysOfWeek: customer.subscription?.daysOfWeek || [0, 1, 2, 3, 4, 5, 6],
    });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedCustomer) return;

    if (editForm.daysOfWeek.length === 0) {
      toast.error('Please select at least one delivery day');
      return;
    }

    setCustomers(customers.map(c => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          subscription: {
            ...c.subscription!,
            milkProductId: editForm.milkProductId,
            quantityPerDelivery: editForm.quantityPerDelivery,
            daysOfWeek: editForm.daysOfWeek,
          },
        };
      }
      return c;
    }));

    setIsEditing(false);
    setSelectedCustomer(null);
    toast.success('Customer subscription updated!');
  };

  const getScheduleLabel = (daysOfWeek: number[]) => {
    if (daysOfWeek.length === 7) return 'Daily';
    if (daysOfWeek.length === 6 && !daysOfWeek.includes(0)) return 'Mon-Sat';
    if (daysOfWeek.length === 5 && !daysOfWeek.includes(0) && !daysOfWeek.includes(6)) return 'Weekdays';
    return daysOfWeek.map(d => DAYS_OF_WEEK[d]).join(', ');
  };

  const CustomerCard = ({ customer, index, isPaused }: { customer: typeof customers[0], index: number, isPaused: boolean }) => {
    const milk = milkProducts.find(m => m.id === customer.subscription?.milkProductId);
    const mockArea = PUNE_AREAS[(index % (PUNE_AREAS.length - 1)) + 1];
    
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
          onClick={() => handleEditCustomer(customer)}
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
                    <MapPin className="w-3 h-3" /> {mockArea}
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
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditCustomer(customer); }}>
                    <Edit2 className="w-4 h-4 mr-2" /> Edit Plan
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
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 font-medium text-primary">
                  <Droplets className="w-3.5 h-3.5" /> {customer.subscription?.quantityPerDelivery}L
                </span>
                <span className="text-muted-foreground">{milk?.name}</span>
                <span className="text-xs bg-accent px-2 py-0.5 rounded-full">
                  {getScheduleLabel(customer.subscription?.daysOfWeek || [])}
                </span>
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

  // Milk Type Selection Component with Brand categories
  const MilkTypeSelector = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
    const selectedProduct = milkProducts.find(p => p.id === value);
    const [expandedBrand, setExpandedBrand] = useState<string | null>(selectedProduct?.brandId || null);
    
    const getProductsByBrand = (brandId: string) => milkProducts.filter(p => p.brandId === brandId);
    
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Brand & Milk Type *</label>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {milkBrands.map(brand => {
            const products = getProductsByBrand(brand.id);
            const isExpanded = expandedBrand === brand.id;
            const hasSelected = products.some(p => p.id === value);
            
            return (
              <div key={brand.id} className={`rounded-xl border-2 overflow-hidden ${hasSelected ? 'border-primary' : 'border-border'}`}>
                <button
                  type="button"
                  onClick={() => setExpandedBrand(isExpanded ? null : brand.id)}
                  className="w-full p-3 flex items-center justify-between bg-card hover:bg-accent/50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{brand.logo}</span>
                    <span className="font-medium text-sm">{brand.name}</span>
                  </div>
                  {hasSelected && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Selected</span>}
                </button>
                {isExpanded && (
                  <div className="p-2 pt-0 grid grid-cols-1 gap-1 bg-accent/30">
                    {products.map(product => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => onChange(product.id)}
                        className={`p-2 rounded-lg flex items-center justify-between text-sm ${
                          value === product.id ? 'bg-primary/10 text-primary' : 'bg-card hover:bg-accent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{product.icon}</span>
                          <span>{product.name}</span>
                        </span>
                        <span className="font-medium">₹{product.pricePerLiter}/L</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Quantity Selector Component
  const QuantitySelector = ({ value, onAdjust }: { value: number; onAdjust: (delta: number) => void }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">Daily Quantity *</label>
      <div className="flex items-center justify-center gap-4 bg-accent/50 rounded-xl p-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onAdjust(-0.5)}
          disabled={value <= 0.5}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <div className="text-center min-w-[80px]">
          <span className="text-3xl font-bold text-primary">{value}</span>
          <span className="text-lg ml-1">L</span>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => onAdjust(0.5)}
          disabled={value >= 5}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  // Days Selector Component
  const DaysSelector = ({ selectedDays, onToggle }: { selectedDays: number[]; onToggle: (day: number) => void }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        Delivery Days *
      </label>
      <div className="grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((day, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onToggle(index)}
            className={`py-2 px-1 rounded-lg text-xs font-medium transition-all ${
              selectedDays.includes(index)
                ? 'bg-primary text-primary-foreground'
                : 'bg-accent hover:bg-accent/80 text-muted-foreground'
            }`}
          >
            {day}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          className="text-xs"
          onClick={() => {
            DAYS_OF_WEEK.forEach((_, i) => {
              if (!selectedDays.includes(i)) onToggle(i);
            });
          }}
        >
          Select All
        </Button>
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          className="text-xs"
          onClick={() => {
            [1, 2, 3, 4, 5, 6].forEach(i => {
              if (!selectedDays.includes(i)) onToggle(i);
            });
            if (selectedDays.includes(0)) onToggle(0);
          }}
        >
          Mon-Sat
        </Button>
      </div>
    </div>
  );

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
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
          
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Filter className="w-4 h-4" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-w-md mx-auto rounded-t-2xl">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  <span>Filter Customers</span>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-1" /> Clear
                    </Button>
                  )}
                </SheetTitle>
              </SheetHeader>
              
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Area in Pune</label>
                  <Select value={areaFilter} onValueChange={setAreaFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {PUNE_AREAS.map(area => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Order Quantity</label>
                  <div className="grid grid-cols-2 gap-2">
                    {QUANTITY_FILTERS.map(filter => (
                      <Button
                        key={filter.id}
                        variant={quantityFilter === filter.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setQuantityFilter(filter.id)}
                        className="text-xs"
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="fresh" 
                  className="w-full" 
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {areaFilter !== 'All Areas' && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {areaFilter}
                <button onClick={() => setAreaFilter('All Areas')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {quantityFilter !== 'all' && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
                <Droplets className="w-3 h-3" /> {QUANTITY_FILTERS.find(f => f.id === quantityFilter)?.label}
                <button onClick={() => setQuantityFilter('all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

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
        <DialogContent className="max-w-[360px] rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-5 pt-2">
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Flat/House</label>
                <Input 
                  placeholder="A-101"
                  value={newCustomer.flat}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, flat: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Building</label>
                <Input 
                  placeholder="Sunrise Towers"
                  value={newCustomer.building}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, building: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Area</label>
              <Select 
                value={newCustomer.area} 
                onValueChange={(val) => setNewCustomer(prev => ({ ...prev, area: val }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {PUNE_AREAS.slice(1).map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-semibold mb-3">Subscription Plan</p>
              
              <MilkTypeSelector 
                value={newCustomer.milkProductId}
                onChange={(val) => setNewCustomer(prev => ({ ...prev, milkProductId: val }))}
              />
            </div>

            <QuantitySelector 
              value={newCustomer.quantityPerDelivery}
              onAdjust={(delta) => adjustQuantity(delta, true)}
            />

            <DaysSelector 
              selectedDays={newCustomer.daysOfWeek}
              onToggle={(day) => toggleDayOfWeek(day, true)}
            />

            <Button variant="fresh" className="w-full" onClick={handleAddCustomer}>
              <UserPlus className="w-4 h-4 mr-2" /> Add Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditing && !!selectedCustomer} onOpenChange={() => { setIsEditing(false); setSelectedCustomer(null); }}>
        <DialogContent className="max-w-[360px] rounded-2xl max-h-[90vh] overflow-y-auto">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle>Edit {selectedCustomer.name}'s Plan</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-5 pt-2">
                {/* Customer Info */}
                <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedCustomer.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
                  </div>
                </div>

                <MilkTypeSelector 
                  value={editForm.milkProductId}
                  onChange={(val) => setEditForm(prev => ({ ...prev, milkProductId: val }))}
                />

                <QuantitySelector 
                  value={editForm.quantityPerDelivery}
                  onAdjust={(delta) => adjustQuantity(delta, false)}
                />

                <DaysSelector 
                  selectedDays={editForm.daysOfWeek}
                  onToggle={(day) => toggleDayOfWeek(day, false)}
                />

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleTogglePause(selectedCustomer.id)}
                  >
                    {pausedCustomers.includes(selectedCustomer.id) ? (
                      <><Play className="w-4 h-4 mr-2" /> Resume</>
                    ) : (
                      <><Pause className="w-4 h-4 mr-2" /> Pause</>
                    )}
                  </Button>
                  <Button 
                    variant="fresh" 
                    className="flex-1"
                    onClick={handleSaveEdit}
                  >
                    <Save className="w-4 h-4 mr-2" /> Save
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