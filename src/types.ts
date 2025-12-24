export interface Order {
  id: string;
  customerName: string;
  phone: string;
  size: RosconSize;
  filling: RosconFilling;
  quantity: number;
  price: number;
  deliveryDate: string;
  notes: string;
  status: OrderStatus;
  paid: boolean;
  paymentMethod: PaymentMethod | null;
  createdAt: string;
}

export type RosconSize = 'mini' | 'pequeño' | 'mediano' | 'grande';

export type RosconFilling = 'sin relleno' | 'nata' | 'trufa' | 'crema' | 'chocolate' | 'nata, trufa' |  'nata, crema' |  'nata, chocolate' |  'trufa, crema' |  'trufa, chocolate' |  'crema, chocolate' | 'nata, trufa, crema' |  'nata, trufa, chocolate' |  'nata, crema, chocolate' |  'trufa, crema, chocolate';

export type OrderStatus = 'pendiente' | 'preparando' | 'listo' | 'entregado';

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia' | 'bizum';

export const ROSCON_SIZES: RosconSize[] = ['mini', 'pequeño', 'mediano', 'grande'];

export const ROSCON_FILLINGS: RosconFilling[] = ['sin relleno', 'nata', 'trufa', 'crema', 'chocolate', 'nata, trufa', 'nata, crema', 'nata, chocolate', 'trufa, crema', 'trufa, chocolate', 'crema, chocolate', 'nata, trufa, crema',  'nata, trufa, chocolate',  'nata, crema, chocolate',  'trufa, crema, chocolate'];

export const ORDER_STATUS: OrderStatus[] = ['pendiente', 'preparando', 'listo', 'entregado'];

export const PAYMENT_METHODS: PaymentMethod[] = ['efectivo', 'tarjeta', 'transferencia', 'bizum'];