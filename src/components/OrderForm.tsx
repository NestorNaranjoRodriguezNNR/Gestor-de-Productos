import { useState, useEffect } from 'react';
import { Order, ROSCON_SIZES, ROSCON_FILLINGS, ORDER_STATUS, PAYMENT_METHODS } from '../types';
import { X } from 'lucide-react';
import { getUnitPrice } from '../data/prices';

interface OrderFormProps {
  order: Order | null;
  onSave: (order: any) => void;
  onCancel: () => void;
}

export function OrderForm({ order, onSave, onCancel }: OrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    size: 'mediano' as Order['size'],
    filling: 'nata' as Order['filling'],
    quantity: '1',
    price: '',
    deliveryDate: '',
    notes: '',
    status: 'pendiente' as Order['status'],
    paid: false,
    paymentMethod: null as Order['paymentMethod'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customerName,
        phone: order.phone,
        size: order.size,
        filling: order.filling,
        quantity: order.quantity.toString(),
        price: order.price.toString(),
        deliveryDate: order.deliveryDate,
        notes: order.notes,
        status: order.status,
        paid: order.paid,
        paymentMethod: order.paymentMethod,
      });
    }
  }, [order]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      return next;
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Auto-calculate price based on size, filling and quantity
  useEffect(() => {
    const unit = getUnitPrice(formData.filling as any, formData.size as any);
    const qty = parseInt(String(formData.quantity)) || 0;
    const total = unit * qty;
    if (!isNaN(total) && total > 0) {
      setFormData(prev => ({ ...prev, price: total.toFixed(2) }));
    } else {
      setFormData(prev => ({ ...prev, price: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.size, formData.filling, formData.quantity]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'El nombre del cliente es obligatorio';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'La fecha de entrega es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const orderData = {
      ...(order && { id: order.id, createdAt: order.createdAt }),
      customerName: formData.customerName,
      phone: formData.phone,
      size: formData.size,
      filling: formData.filling,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price),
      deliveryDate: formData.deliveryDate,
      notes: formData.notes,
      status: formData.status,
      paid: formData.paid,
      paymentMethod: formData.paymentMethod,
    };

    onSave(orderData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-orange-100 overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="text-3xl"></div>
            <h2 className="text-gray-900">
              {order ? 'Editar Pedido' : 'Nuevo Pedido'}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Nombre del Cliente *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.customerName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: María García"
              />
              {errors.customerName && (
                <p className="mt-1 text-red-600">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="666 123 456"
              />
              {errors.phone && (
                <p className="mt-1 text-red-600">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Roscon Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Tamaño *
              </label>
              <select
                value={formData.size}
                onChange={(e) => handleChange('size', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {ROSCON_SIZES.map(size => (
                  <option key={size} value={size} className="capitalize">{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Relleno *
              </label>
              <select
                value={formData.filling}
                onChange={(e) => handleChange('filling', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {ROSCON_FILLINGS.map(filling => (
                  <option key={filling} value={filling} className="capitalize">{filling}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity and Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Cantidad *
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.quantity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="1"
              />
              {errors.quantity && (
                <p className="mt-1 text-red-600">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Precio Total *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                  €
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  readOnly
                  className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              <p className="mt-1 text-sm text-gray-600">Precio calculado automáticamente por tamaño y relleno</p>
              {errors.price && (
                <p className="mt-1 text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                {ORDER_STATUS.map(status => (
                  <option key={status} value={status} className="capitalize">{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Delivery Date */}
          <div>
            <label className="block text-gray-700 mb-2">
              Fecha de Entrega *
            </label>
            <input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => handleChange('deliveryDate', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.deliveryDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.deliveryDate && (
              <p className="mt-1 text-red-600">{errors.deliveryDate}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-700 mb-2">
              Notas Adicionales
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ej: Sin frutos secos, recoger por la mañana..."
            />
          </div>

          {/* Payment Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-gray-900 mb-4">Información de Pago</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.paid}
                    onChange={(e) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        paid: e.target.checked,
                        paymentMethod: e.target.checked ? 'efectivo' : null
                      }));
                    }}
                    className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <div>
                    <p className="text-gray-900">Pedido Pagado</p>
                    <p className="text-gray-600 text-xs">Marcar si el pago se ha recibido</p>
                  </div>
                </label>
              </div>

              {formData.paid && (
                <div>
                  <label className="block text-gray-700 mb-2">
                    Método de Pago
                  </label>
                  <select
                    value={formData.paymentMethod || 'efectivo'}
                    onChange={(e) => handleChange('paymentMethod', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  >
                    {PAYMENT_METHODS.map(method => (
                      <option key={method} value={method} className="capitalize">{method}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all shadow-md"
            >
              {order ? 'Actualizar' : 'Crear'} Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}