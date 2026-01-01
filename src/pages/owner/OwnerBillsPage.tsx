import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { 
  Search, Check, AlertCircle, ChevronLeft, ChevronRight,
  Share2, Download, IndianRupee, Phone, MessageSquare, Receipt
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export const OwnerBillsPage: React.FC = () => {
  const { customers, milkProducts } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState<typeof customerBills[0] | null>(null);
  const [paidBills, setPaidBills] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthName = currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  // Calculate bills for each customer
  const customerBills = customers.map(customer => {
    const milk = milkProducts.find(m => m.id === customer.subscription?.milkProductId);
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const deliveryDays = customer.subscription?.daysOfWeek?.length === 7 ? daysInMonth : 
      Math.floor(daysInMonth * (customer.subscription?.daysOfWeek?.length || 0) / 7);
    const totalAmount = deliveryDays * (customer.subscription?.quantityPerDelivery || 0) * (milk?.pricePerLiter || 0);
    const isPaid = paidBills.includes(`${customer.id}-${currentMonth.getMonth()}`);
    
    return {
      ...customer,
      milk,
      totalAmount,
      deliveryDays,
      isPaid,
    };
  }).filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalCollection = customerBills.reduce((sum, c) => sum + c.totalAmount, 0);
  const paidAmount = customerBills.filter(c => c.isPaid).reduce((sum, c) => sum + c.totalAmount, 0);
  const pendingAmount = totalCollection - paidAmount;

  const handleMarkPaid = (customerId: string) => {
    const billId = `${customerId}-${currentMonth.getMonth()}`;
    setPaidBills(prev => [...prev, billId]);
    toast.success('Bill marked as paid!');
  };

  const handleMarkUnpaid = (customerId: string) => {
    const billId = `${customerId}-${currentMonth.getMonth()}`;
    setPaidBills(prev => prev.filter(id => id !== billId));
    toast.info('Bill marked as unpaid');
  };

  const handleShareBill = (customer: typeof customerBills[0]) => {
    const message = `Hi ${customer.name}, your milk bill for ${monthName} is ₹${customer.totalAmount}. Please pay at your earliest convenience. - Dairy Shop`;
    window.open(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const changeMonth = (delta: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <MobileLayout isOwner>
      <div className="px-5 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Bills & Payments</h1>
          
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

      <div className="px-5 space-y-4 pb-24">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="fresh" className="p-3 text-center">
            <IndianRupee className="w-5 h-5 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold">₹{totalCollection}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </Card>
          <Card className="p-3 text-center bg-emerald-50 border-emerald-200">
            <Check className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
            <p className="text-lg font-bold text-emerald-700">₹{paidAmount}</p>
            <p className="text-xs text-emerald-600">Collected</p>
          </Card>
          <Card className="p-3 text-center bg-amber-50 border-amber-200">
            <AlertCircle className="w-5 h-5 mx-auto mb-1 text-amber-600" />
            <p className="text-lg font-bold text-amber-700">₹{pendingAmount}</p>
            <p className="text-xs text-amber-600">Pending</p>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>

        {/* Customer Bills List */}
        <div className="space-y-3">
          {customerBills.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
                <Card 
                  variant="interactive"
                  className={customer.isPaid ? 'border-emerald-200 bg-emerald-50/30' : ''}
                  onClick={() => setSelectedBill(customer)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                        ${customer.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-accent text-primary'}`}>
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.deliveryDays} deliveries • {customer.milk?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">₹{customer.totalAmount}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        customer.isPaid 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {customer.isPaid ? 'Paid' : 'Due'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {customerBills.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground">No bills found</p>
          </div>
        )}
      </div>

      {/* Bill Detail Dialog */}
      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          {selectedBill && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedBill.name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 pt-2">
                <div className="text-center py-4 bg-accent/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">{monthName}</p>
                  <p className="text-4xl font-bold">₹{selectedBill.totalAmount}</p>
                  <span className={`text-sm px-3 py-1 rounded-full mt-2 inline-block ${
                    selectedBill.isPaid 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedBill.isPaid ? '✓ Paid' : 'Payment Due'}
                  </span>
                </div>

                <div className="space-y-2 bg-muted/50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Milk Type</span>
                    <span className="font-medium">{selectedBill.milk?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate</span>
                    <span className="font-medium">₹{selectedBill.milk?.pricePerLiter}/L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity/Day</span>
                    <span className="font-medium">{selectedBill.subscription?.quantityPerDelivery}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Days</span>
                    <span className="font-medium">{selectedBill.deliveryDays} days</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">₹{selectedBill.totalAmount}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleShareBill(selectedBill)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      toast.success('Bill downloaded!');
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" /> PDF
                  </Button>
                </div>

                {selectedBill.isPaid ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      handleMarkUnpaid(selectedBill.id);
                      setSelectedBill(null);
                    }}
                  >
                    Mark as Unpaid
                  </Button>
                ) : (
                  <Button 
                    variant="fresh" 
                    className="w-full"
                    onClick={() => {
                      handleMarkPaid(selectedBill.id);
                      setSelectedBill(null);
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" /> Mark as Paid
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </MobileLayout>
  );
};
