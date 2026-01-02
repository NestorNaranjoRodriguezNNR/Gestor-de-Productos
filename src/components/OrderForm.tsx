import { useState, useEffect } from 'react';
import {
  Order,
  OrderInput,
  ROSCON_SIZES,
  ROSCON_FILLINGS,
  ORDER_STATUS,
  PAYMENT_METHODS,
  RosconSize,
  RosconFilling,
} from '../types';
import { X, Plus, Trash2 } from 'lucide-react';
import { getUnitPrice } from '../data/prices';

interface OrderFormProps {
  order: Order | null;
  onSave: (orderInput: OrderInput) => void;
  onCancel: () => void;
}

//  Definición local: NO extiende RosconItem
interface FormRosconItem {
  size: RosconSize;
  filling: RosconFilling;
  quantity: string; // <-- string para el input
  unitPrice: number;
  total: number;
}

export function OrderForm({ order, onSave, onCancel }: OrderFormProps) {
  const [items, setItems] = useState<FormRosconItem[]>([
    {
      size: 'mediano',
      filling: 'nata',
      quantity: '1',
      unitPrice: getUnitPrice('nata', 'mediano'),
      total: getUnitPrice('nata', 'mediano'),
    },
  ]);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    deliveryDate: '',
    notes: '',
    status: 'pendiente' as Order['status'],
    paid: false,
    paymentMethod: null as Order['paymentMethod'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!order) return;

    setFormData({
      customerName: order.customerName,
      phone: order.phone,
      deliveryDate: order.deliveryDate,
      notes: order.notes,
      status: order.status,
      paid: order.paid,
      paymentMethod: order.paymentMethod,
    });

    if (order.items && order.items.length > 0) {
      setItems(
        order.items.map(i => ({
          size: i.size,
          filling: i.filling,
          quantity: i.quantity.toString(),
          unitPrice: i.unitPrice,
          total: i.total,
        }))
      );
    } else {
      setItems([
        {
          size: order.size!,
          filling: order.filling!,
          quantity: order.quantity!.toString(),
          unitPrice: getUnitPrice(order.filling!, order.size!),
          total: order.price,
        },
      ]);
    }
  }, [order]);

  useEffect(() => {
    setItems(prev =>
      prev.map(item => {
        const unit = getUnitPrice(item.filling, item.size);
        const qty = parseInt(item.quantity) || 0;
        return {
          ...item,
          unitPrice: unit,
          total: unit * qty,
        };
      })
    );
  }, [items.map(i => `${i.size}-${i.filling}-${i.quantity}`).join('|')]);

  const totalPedido = items.reduce((sum, i) => sum + i.total, 0);

  const handleGeneralChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateItem = (index: number, field: keyof FormRosconItem, value: string) => {
    setItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    if (errors.items) {
      setErrors(prev => ({ ...prev, items: '' }));
    }
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        size: 'mediano',
        filling: 'nata',
        quantity: '1',
        unitPrice: getUnitPrice('nata', 'mediano'),
        total: getUnitPrice('nata', 'mediano'),
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
    if (errors.items) {
      setErrors(prev => ({ ...prev, items: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'El nombre del cliente es obligatorio';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'La fecha de entrega es obligatoria';
    }
    const hasInvalidQuantity = items.some(i => !i.quantity || parseInt(i.quantity) <= 0);
    if (hasInvalidQuantity) {
      newErrors.items = 'Todas las cantidades deben ser mayores a 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  const newItems = items.map(i => ({
    size: i.size,
    filling: i.filling,
    quantity: parseInt(i.quantity),
    unitPrice: i.unitPrice,
    total: i.total,
  }));

  const orderInput: OrderInput = {
    ...formData,
    items: newItems,
    size: undefined,
    filling: undefined,
    quantity: undefined,
    price: totalPedido,
  };

  onSave(orderInput);
};;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl border border-orange-100 overflow-hidden shadow-lg">
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="text-3xl"></div>
            <h2 className="text-gray-900">{order ? 'Editar Pedido' : 'Nuevo Pedido'}</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Nombre del Cliente *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleGeneralChange('customerName', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.customerName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: María García"
              />
              {errors.customerName && <p className="mt-1 text-red-600">{errors.customerName}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Teléfono *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleGeneralChange('phone', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="666 123 456"
              />
              {errors.phone && <p className="mt-1 text-red-600">{errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-900">Detalles del Roscón</h3>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-3 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-gray-700 mb-2">Tamaño</label>
                  <select
                    value={item.size}
                    onChange={(e) => updateItem(index, 'size', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white capitalize"
                  >
                    {ROSCON_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Relleno</label>
                  <select
                    value={item.filling}
                    onChange={(e) => updateItem(index, 'filling', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white capitalize"
                  >
                    {ROSCON_FILLINGS.map(filling => (
                      <option key={filling} value={filling}>{filling}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.items ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    disabled={items.length === 1}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700"
            >
              <Plus className="w-4 h-4" /> Añadir otro roscón
            </button>
            {errors.items && <p className="mt-1 text-red-600">{errors.items}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Precio Total *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">€</span>
              <input
                type="text"
                value={totalPedido.toFixed(2)}
                readOnly
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <p className="mt-1 text-sm text-gray-600">Precio calculado automáticamente</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Fecha de Entrega *</label>
            <input
              type="date"
              value={formData.deliveryDate}
              onChange={(e) => handleGeneralChange('deliveryDate', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.deliveryDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.deliveryDate && <p className="mt-1 text-red-600">{errors.deliveryDate}</p>}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Notas Adicionales</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleGeneralChange('notes', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ej: Sin frutos secos, recoger por la mañana..."
            />
          </div>

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
                        paymentMethod: e.target.checked ? 'efectivo' : null,
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
                  <label className="block text-gray-700 mb-2">Método de Pago</label>
                  <select
                    value={formData.paymentMethod || 'efectivo'}
                    onChange={(e) => handleGeneralChange('paymentMethod', e.target.value)}
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