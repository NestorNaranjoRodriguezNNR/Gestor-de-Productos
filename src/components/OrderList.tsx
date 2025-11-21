import { useState, useMemo } from 'react';
import { Order, ROSCON_SIZES, ROSCON_FILLINGS } from '../types';
import { Search, Filter, Edit2, Trash2, Phone, Calendar, CreditCard, CheckCircle, XCircle } from 'lucide-react';

interface OrderListProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Order['status']) => void;
}

export function OrderList({ orders, onEdit, onDelete, onUpdateStatus }: OrderListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState<string>('all');
  const [fillingFilter, setFillingFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'customer' | 'deliveryDate'>('deliveryDate');

  const filteredOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.phone.includes(searchTerm);
      
      const matchesSize = sizeFilter === 'all' || order.size === sizeFilter;
      const matchesFilling = fillingFilter === 'all' || order.filling === fillingFilter;
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesSize && matchesFilling && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'customer') return a.customerName.localeCompare(b.customerName);
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'deliveryDate') return new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime();
      return 0;
    });

    return filtered;
  }, [orders, searchTerm, sizeFilter, fillingFilter, statusFilter, sortBy]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Pedidos</h2>
        <p className="text-gray-600">Gestiona todos los pedidos de roscones</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-orange-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cliente o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
              >
                <option value="all">Todos los tamaños</option>
                {ROSCON_SIZES.map(size => (
                  <option key={size} value={size} className="capitalize">{size}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filling Filter */}
          <div>
            <select
              value={fillingFilter}
              onChange={(e) => setFillingFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
            >
              <option value="all">Todos los rellenos</option>
              {ROSCON_FILLINGS.map(filling => (
                <option key={filling} value={filling} className="capitalize">{filling}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="preparando">Preparando</option>
              <option value="listo">Listo</option>
              <option value="entregado">Entregado</option>
            </select>
          </div>
        </div>

        {/* Sort */}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-gray-600">Ordenar por:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('deliveryDate')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                sortBy === 'deliveryDate'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fecha Entrega
            </button>
            <button
              onClick={() => setSortBy('customer')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                sortBy === 'customer'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cliente
            </button>
            <button
              onClick={() => setSortBy('date')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                sortBy === 'date'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fecha Pedido
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido' : 'pedidos'}
        </p>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-orange-100 text-center">
          <div className="text-6xl mb-4"></div>
          <p className="text-gray-600">No se encontraron pedidos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onEdit={onEdit}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Order['status']) => void;
}

function OrderCard({ order, onEdit, onDelete, onUpdateStatus }: OrderCardProps) {
  const isUrgent = new Date(order.deliveryDate).getTime() - Date.now() < 86400000; // Less than 24h

  return (
    <div className={`bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-shadow ${
      isUrgent && order.status !== 'entregado' ? 'border-red-300' : 'border-orange-100'
    }`}>
      {/* Header with crown emoji */}
      <div className={`p-4 ${
        isUrgent && order.status !== 'entregado' 
          ? 'bg-gradient-to-r from-red-50 to-orange-50' 
          : 'bg-gradient-to-r from-orange-50 to-yellow-50'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl"></div>
            <div>
              <h3 className="text-gray-900">{order.customerName}</h3>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Phone className="w-4 h-4" />
                <span>{order.phone}</span>
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs ${
            order.status === 'entregado' ? 'bg-gray-100 text-gray-700' :
            order.status === 'listo' ? 'bg-green-100 text-green-700' :
            order.status === 'preparando' ? 'bg-yellow-100 text-yellow-700' :
            'bg-orange-100 text-orange-700'
          }`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Order Info */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-600 mb-1">Tamaño</p>
            <p className="text-gray-900 capitalize">{order.size}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Relleno</p>
            <p className="text-gray-900 capitalize">{order.filling}</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Cantidad</p>
            <p className="text-gray-900">{order.quantity} unidades</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Precio</p>
            <p className="text-gray-900">€{order.price.toFixed(2)}</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
          isUrgent && order.status !== 'entregado' 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-orange-50 border border-orange-200'
        }`}>
          <Calendar className={`w-5 h-5 ${isUrgent && order.status !== 'entregado' ? 'text-red-600' : 'text-orange-600'}`} />
          <div>
            <p className={`${isUrgent && order.status !== 'entregado' ? 'text-red-900' : 'text-orange-900'}`}>
              Entrega: {new Date(order.deliveryDate).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
            {isUrgent && order.status !== 'entregado' && (
              <p className="text-red-700 text-xs">¡Entrega urgente!</p>
            )}
          </div>
        </div>

        {order.notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Notas:</p>
            <p className="text-gray-900">{order.notes}</p>
          </div>
        )}

        {/* Payment Status */}
        <div className={`mb-4 p-3 rounded-lg border flex items-center gap-3 ${
          order.paid 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          {order.paid ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-green-900">Pagado</p>
                <p className="text-green-700 text-xs capitalize">Método: {order.paymentMethod}</p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-yellow-900">Pendiente de pago</p>
              </div>
            </>
          )}
        </div>

        {/* Status Update Buttons */}
        {order.status !== 'entregado' && (
          <div className="mb-4">
            <p className="text-gray-600 mb-2">Cambiar estado:</p>
            <div className="flex gap-2 flex-wrap">
              {order.status !== 'preparando' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'preparando')}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-xs"
                >
                  En preparación
                </button>
              )}
              {order.status !== 'listo' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'listo')}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs"
                >
                  Listo
                </button>
              )}
              <button
                onClick={() => onUpdateStatus(order.id, 'entregado')}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs"
              >
                Entregado
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(order)}
            className="flex-1 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={() => onDelete(order.id)}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}