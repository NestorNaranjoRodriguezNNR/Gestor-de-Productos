


// ─────────────────────────────────────────────
// TIPOS BASE
// ─────────────────────────────────────────────

export type RosconSize =
  | 'mini'
  | 'pequeño'
  | 'mediano'
  | 'grande';

export type RosconFilling =
  | 'sin relleno'
  | 'nata'
  | 'trufa'
  | 'crema'
  | 'chocolate'
  | 'nata, trufa'
  | 'nata, crema'
  | 'nata, chocolate'
  | 'trufa, crema'
  | 'trufa, chocolate'
  | 'crema, chocolate'
  | 'nata, trufa, crema'
  | 'nata, trufa, chocolate'
  | 'nata, crema, chocolate'
  | 'trufa, crema, chocolate';

export type OrderStatus =
  | 'pendiente'
  | 'preparando'
  | 'listo'
  | 'entregado';

export type PaymentMethod =
  | 'efectivo'
  | 'tarjeta'
  | 'transferencia'
  | 'bizum';

// ─────────────────────────────────────────────
// NUEVO: ÍTEM DE ROSCÓN (UN PRODUCTO)
// ─────────────────────────────────────────────

export interface RosconItem {
  size: RosconSize;
  filling: RosconFilling;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ─────────────────────────────────────────────
// PEDIDO
// ─────────────────────────────────────────────

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  deliveryDate: string;

  /**
   * NUEVO (multi-roscón)
   * Un pedido puede tener varios roscones
   */
  items?: RosconItem[];

  /**
   * CAMPOS ANTIGUOS (compatibilidad)
   * Se mantienen para pedidos antiguos
   */
  size?: RosconSize;
  filling?: RosconFilling;
  quantity?: number;

  price: number;
  notes: string;
  status: OrderStatus;
  paid: boolean;
  paymentMethod: PaymentMethod | null;
  createdAt: string;
}

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────

export const ROSCON_SIZES: RosconSize[] = [
  'mini',
  'pequeño',
  'mediano',
  'grande',
];

export const ROSCON_FILLINGS: RosconFilling[] = [
  'sin relleno',
  'nata',
  'trufa',
  'crema',
  'nata, trufa',
  'nata, crema',
  'trufa, crema',
  'nata, trufa, crema',
];

export const ORDER_STATUS: OrderStatus[] = [
  'pendiente',
  'preparando',
  'listo',
  'entregado',
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  'efectivo',
  'tarjeta',
  'transferencia',
  'bizum',
];

export type OrderInput = Omit<Order, 'id' | 'createdAt'>;