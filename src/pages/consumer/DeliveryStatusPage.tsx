import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MobileLayout } from '@/components/MobileLayout';
import { ArrowLeft, CheckCircle, Circle, Truck, Package, AlertCircle } from 'lucide-react';

// Mock delivery status
const deliveryStatus = {
  status: 'out_for_delivery', // 'pending', 'accepted', 'out_for_delivery', 'delivered', 'missed'
  steps: [
    { id: 'accepted', label: 'Order Accepted', time: '5:30 AM', completed: true },
    { id: 'out_for_delivery', label: 'Out for Delivery', time: '6:00 AM', completed: true },
    { id: 'delivered', label: 'Delivered', time: null, completed: false },
  ],
  milkman: 'Ramesh Kumar',
  expectedTime: '6:15 - 6:30 AM',
};

export const DeliveryStatusPage: React.FC = () => {
  const navigate = useNavigate();

  const getStatusIcon = (step: typeof deliveryStatus.steps[0], isActive: boolean) => {
    if (step.completed) {
      return <CheckCircle className="w-6 h-6 text-primary" />;
    }
    if (isActive) {
      return <Circle className="w-6 h-6 text-primary animate-pulse" />;
    }
    return <Circle className="w-6 h-6 text-muted-foreground" />;
  };

  return (
    <MobileLayout
      header={
        <div className="flex items-center gap-3 px-5 py-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-accent rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Delivery Status</h1>
        </div>
      }
    >
      <div className="px-5 py-6 space-y-6">
        {/* Today's Delivery Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl gradient-fresh flex items-center justify-center shadow-glow">
            <Truck className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Today's Delivery</h2>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </motion.div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-5">
              <div className="space-y-0">
                {deliveryStatus.steps.map((step, index) => {
                  const isActive = !step.completed && deliveryStatus.steps[index - 1]?.completed;
                  const isLast = index === deliveryStatus.steps.length - 1;
                  
                  return (
                    <div key={step.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(step, isActive)}
                        {!isLast && (
                          <div className={`w-0.5 h-12 ${step.completed ? 'bg-primary' : 'bg-border'}`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`font-medium ${step.completed || isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.time || (isActive ? `Expected: ${deliveryStatus.expectedTime}` : 'Pending')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Milkman Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="fresh">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">🧑‍🌾</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{deliveryStatus.milkman}</p>
                <p className="text-sm text-muted-foreground">Your delivery person</p>
              </div>
              <Button variant="soft" size="sm">
                Call
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Report Issue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button variant="outline" size="lg" className="w-full">
            <AlertCircle className="w-5 h-5 mr-2" />
            Report an Issue
          </Button>
        </motion.div>
      </div>
    </MobileLayout>
  );
};
