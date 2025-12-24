import { useState, useEffect } from 'react';
import { IonApp, IonContent } from '@ionic/react';
import { Dashboard } from './components/Dashboard';
import { OrderList } from './components/OrderList';
import { OrderForm } from './components/OrderForm';
import { Reports } from './components/Reports';
import { Navigation } from './components/Navigation';
import { Order } from './types';

type View = 'dashboard' | 'orders' | 'reports';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

  // Load orders from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('roscon_orders');
    if (stored) {
      setOrders(JSON.parse(stored));
    } else {
      // Initialize with sample data
      const sampleOrders: Order[] = [
        {
          id: '1',
          customerName: 'María García',
          phone: '666123456',
          size: 'grande',
          filling: 'nata',
          quantity: 2,
          price: 45.00,
          deliveryDate: '2025-01-06',
          notes: 'Recoger por la mañana',
          status: 'pendiente',
          paid: true,
          paymentMethod: 'bizum',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          customerName: 'Juan Pérez',
          phone: '677234567',
          size: 'grande',
          filling: 'trufa',
          quantity: 1,
          price: 25.00,
          deliveryDate: '2025-01-06',
          notes: '',
          status: 'pendiente',
          paid: false,
          paymentMethod: null,
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          customerName: 'Marta Ruiz',
          phone: '600111222',
          size: 'mini',
          filling: 'sin relleno',
          quantity: 6,
          price: 30.00,
          deliveryDate: '2025-01-07',
          notes: '',
          status: 'pendiente',
          paid: false,
          paymentMethod: null,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          customerName: 'Ana Martínez',
          phone: '688345678',
          size: 'mediano',
          filling: 'sin relleno',
          quantity: 3,
          price: 42.00,
          deliveryDate: '2025-01-05',
          notes: 'Sin frutos secos',
          status: 'preparando',
          paid: true,
          paymentMethod: 'tarjeta',
          createdAt: new Date().toISOString(),
        },
      ];
      setOrders(sampleOrders);
      localStorage.setItem('roscon_orders', JSON.stringify(sampleOrders));
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('roscon_orders', JSON.stringify(orders));
    }
  }, [orders]);

  const handleCreateOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setOrders([...orders, newOrder]);
    setShowOrderForm(false);
  };

  const handleUpdateOrder = (order: Order) => {
    setOrders(orders.map(o => o.id === order.id ? order : o));
    setEditingOrder(null);
    setShowOrderForm(false);
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowOrderForm(true);
    setCurrentView('orders');
  };

  const handleNewOrder = () => {
    setEditingOrder(null);
    setShowOrderForm(true);
    setCurrentView('orders');
  };

  const handleCancelForm = () => {
    setEditingOrder(null);
    setShowOrderForm(false);
  };

  return (
    <IonApp>
      <IonContent fullscreen>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50">
        <Navigation 
          currentView={currentView} 
          onViewChange={(view) => {
            setCurrentView(view);
            setShowOrderForm(false);
            setEditingOrder(null);
          }}
          onNewOrder={handleNewOrder}
        />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {currentView === 'dashboard' && (
            <Dashboard orders={orders} onViewOrders={() => setCurrentView('orders')} />
          )}
          
          {currentView === 'orders' && (
            <>
              {showOrderForm ? (
                <OrderForm
                  order={editingOrder}
                  onSave={editingOrder ? handleUpdateOrder : handleCreateOrder}
                  onCancel={handleCancelForm}
                />
              ) : (
                <OrderList
                  orders={orders}
                  onEdit={handleEditOrder}
                  onDelete={handleDeleteOrder}
                  onUpdateStatus={(id, status) => {
                    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
                  }}
                />
              )}
            </>
          )}
          
          {currentView === 'reports' && (
            <Reports orders={orders} />
          )}
        </main>
      </div>
      </IonContent>
    </IonApp>
  );
}