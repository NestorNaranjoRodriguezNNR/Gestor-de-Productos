import { Order } from '../types';
import { ClipboardList, AlertCircle, TrendingUp, DollarSign, Clock } from 'lucide-react';

interface DashboardProps {
  orders: Order[];
  onViewOrders: () => void;
}

export function Dashboard({ orders, onViewOrders }: DashboardProps) {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pendiente' || o.status === 'preparando');
  const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);
const totalRoscones = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);
  const paidOrders = orders.filter(o => o.paid).length;
  const unpaidOrders = orders.filter(o => !o.paid).length;
  const unpaidAmount = orders.filter(o => !o.paid).reduce((sum, o) => sum + o.price, 0);

  // Get orders for today and tomorrow
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.deliveryDate === today);
  const tomorrowOrders = orders.filter(o => o.deliveryDate === tomorrow);

  const stats = [
    {
      label: 'Total Pedidos',
      value: totalOrders,
      icon: <ClipboardList className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
    {
      label: 'Roscones Totales',
      value: totalRoscones,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-yellow-500',
    },
    {
      label: 'Ingresos Totales',
      value: `€${totalRevenue.toFixed(2)}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      label: 'Pedidos Pendientes',
      value: pendingOrders.length,
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'bg-red-500',
    },
  ];

  // Calculate roscones by size
  const rosconesbySize = orders.reduce((acc, order) => {
  const key = order.size ?? 'desconocido'; // valor por defecto si undefined
  acc[key] = (acc[key] || 0) + (order.quantity || 0);
  return acc;
  }, {} as Record<string, number>);
  // Calculate roscones by filling
  const rosconesByFilling = orders.reduce((acc, order) => {
    const key = order.filling ?? 'desconocido'; // valor por defecto si undefined
    acc[key] = (acc[key] || 0) + (order.quantity || 0);
    return acc;
  }, {} as Record<string, number>);


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Panel de Control</h2>
        <p className="text-gray-600">Resumen de pedidos de roscones</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 border border-orange-100 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">{stat.label}</p>
                <p className="text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Urgent Deliveries */}
      {(todayOrders.length > 0 || tomorrowOrders.length > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Clock className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-red-900 mb-2">Entregas Próximas</h3>
              
              {todayOrders.length > 0 && (
                <div className="mb-4">
                  <p className="text-red-700 mb-3">
                    Entregas para HOY ({todayOrders.length} {todayOrders.length === 1 ? 'pedido' : 'pedidos'}):
                  </p>
                  <div className="space-y-2">
                    {todayOrders.map(order => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between bg-white rounded-lg p-3"
                      >
                        <div>
                          <p className="text-gray-900">{order.customerName}</p>
                          <p className="text-gray-600">
                            {order.quantity} x {order.size} ({order.filling})
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          order.status === 'listo' ? 'bg-green-100 text-green-700' :
                          order.status === 'preparando' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tomorrowOrders.length > 0 && (
                <div>
                  <p className="text-red-700 mb-3">
                    Entregas para MAÑANA ({tomorrowOrders.length} {tomorrowOrders.length === 1 ? 'pedido' : 'pedidos'}):
                  </p>
                  <div className="space-y-2">
                    {tomorrowOrders.map(order => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between bg-white rounded-lg p-3"
                      >
                        <div>
                          <p className="text-gray-900">{order.customerName}</p>
                          <p className="text-gray-600">
                            {order.quantity} x {order.size} ({order.filling})
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          order.status === 'listo' ? 'bg-green-100 text-green-700' :
                          order.status === 'preparando' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Production Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Size */}
        <div className="bg-white rounded-xl p-6 border border-orange-100">
          <h3 className="text-gray-900 mb-4">Roscones por Tamaño</h3>
          <div className="space-y-3">
            {Object.entries(rosconesbySize).map(([size, count]) => (
              <div
                key={size}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg"
              >
                <span className="text-gray-700 capitalize">{size}</span>
                <span className="px-4 py-2 bg-white text-orange-600 rounded-full shadow-sm">
                  {count} unidades
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* By Filling */}
        <div className="bg-white rounded-xl p-6 border border-orange-100">
          <h3 className="text-gray-900 mb-4">Roscones por Relleno</h3>
          <div className="space-y-3">
            {Object.entries(rosconesByFilling).map(([filling, count]) => (
              <div
                key={filling}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg"
              >
                <span className="text-gray-700 capitalize">{filling}</span>
                <span className="px-4 py-2 bg-white text-orange-600 rounded-full shadow-sm">
                  {count} unidades
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Status Summary */}
      {unpaidOrders > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-yellow-900 mb-2">Pagos Pendientes</h3>
              <p className="text-yellow-700 mb-4">
                Hay {unpaidOrders} {unpaidOrders === 1 ? 'pedido pendiente' : 'pedidos pendientes'} de pago por un total de €{unpaidAmount.toFixed(2)}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-600 mb-1">Pedidos Pagados</p>
                  <p className="text-gray-900">{paidOrders}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-600 mb-1">Pedidos Sin Pagar</p>
                  <p className="text-gray-900">{unpaidOrders}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-600 mb-1">Monto Pendiente</p>
                  <p className="text-gray-900">€{unpaidAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl p-6 border border-orange-100">
        <h3 className="text-gray-900 mb-4">Pedidos Recientes</h3>
        <div className="space-y-3">
          {orders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map(order => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gradient-to-r from-orange-50/50 to-yellow-50/50 rounded-lg hover:from-orange-50 hover:to-yellow-50 transition-colors gap-3"
              >
                <div className="flex-1">
                  <p className="text-gray-900">{order.customerName}</p>
                  <p className="text-gray-600">
                    {order.quantity} x {order.size} de {order.filling}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-gray-900">€{order.price.toFixed(2)}</p>
                    <p className="text-gray-600">{order.deliveryDate}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                    order.status === 'entregado' ? 'bg-gray-100 text-gray-700' :
                    order.status === 'listo' ? 'bg-green-100 text-green-700' :
                    order.status === 'preparando' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
        {orders.length > 5 && (
          <button
            onClick={onViewOrders}
            className="mt-4 w-full py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
          >
            Ver todos los pedidos
          </button>
        )}
      </div>
    </div>
  );
}