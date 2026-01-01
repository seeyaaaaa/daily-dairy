import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { Receipt, ChevronLeft, ChevronRight, Download, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

// Mock bill data
const mockBillData = {
  month: 'December',
  year: 2024,
  total: 1710,
  isPaid: false,
  deliveries: [
    { date: '2024-12-01', quantity: 1, milk: 'Cow Milk', pricePerLiter: 60, total: 60, status: 'delivered' },
    { date: '2024-12-02', quantity: 1, milk: 'Cow Milk', pricePerLiter: 60, total: 60, status: 'delivered' },
    { date: '2024-12-03', quantity: 1.5, milk: 'Cow Milk', pricePerLiter: 60, total: 90, status: 'delivered' },
    { date: '2024-12-04', quantity: 0, milk: '-', pricePerLiter: 0, total: 0, status: 'paused' },
    { date: '2024-12-05', quantity: 1, milk: 'Cow Milk', pricePerLiter: 60, total: 60, status: 'delivered' },
  ],
};

export const BillsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthName = currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    if (next <= new Date()) {
      setCurrentMonth(next);
    }
  };

  const handleDownload = () => {
    toast.success('Bill downloaded as PDF');
  };

  const handleShare = () => {
    toast.success('Bill shared via WhatsApp');
  };

  return (
    <MobileLayout>
      {/* Header */}
      <div className="px-5 py-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-lg z-10">
        <div className="flex items-center gap-3">
          <Receipt className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-semibold">Monthly Bills</h1>
        </div>
      </div>

      <div className="px-5 py-4 space-y-5 pb-24">
        {/* Month Selector */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <button 
            onClick={handlePrevMonth}
            className="p-2 hover:bg-accent rounded-xl transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-foreground">{monthName}</h2>
          <button 
            onClick={handleNextMonth}
            className="p-2 hover:bg-accent rounded-xl transition-colors disabled:opacity-50"
            disabled={currentMonth.getMonth() >= new Date().getMonth() && currentMonth.getFullYear() >= new Date().getFullYear()}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </motion.div>

        {/* Total Bill Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="elevated" className="overflow-hidden">
            <div className="gradient-fresh p-5">
              <p className="text-primary-foreground/80 text-sm">Total for {mockBillData.month}</p>
              <p className="text-4xl font-bold text-primary-foreground">₹{mockBillData.total}</p>
            </div>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {mockBillData.isPaid ? (
                  <>
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-primary">Paid</span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-destructive">Payment Due</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Breakdown */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Daily Breakdown
          </h3>
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {mockBillData.deliveries.map((delivery, index) => {
                const date = new Date(delivery.date);
                return (
                  <motion.div
                    key={delivery.date}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-foreground leading-none">
                          {date.getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {delivery.quantity > 0 ? `${delivery.quantity}L ${delivery.milk}` : 'Paused'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {date.toLocaleDateString('en-IN', { weekday: 'short' })}
                          {delivery.quantity > 0 && ` · ₹${delivery.pricePerLiter}/L`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {delivery.status === 'delivered' ? (
                        <p className="font-semibold text-foreground">₹{delivery.total}</p>
                      ) : (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          {delivery.status === 'paused' ? 'Paused' : 'Missed'}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.section>
      </div>

      <BottomNav />
    </MobileLayout>
  );
};
