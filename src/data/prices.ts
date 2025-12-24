import { RosconSize, RosconFilling } from '../types';

export const PRICE_TABLE: Record<RosconFilling, Record<RosconSize, number>> = {
  'sin relleno': { mini: 5.0, pequeño: 8.0, mediano: 10.0, grande: 16.0 },
  'nata': { mini: 12.0, pequeño: 15.0, mediano: 18.0, grande: 22.0 },
  'trufa': { mini: 14.0, pequeño: 18.0, mediano: 20.0, grande: 25.0 },
  'crema': { mini: 12.0, pequeño: 15.0, mediano: 18.0, grande: 22.0 },
  'chocolate': { mini: 16.0, pequeño: 20.0, mediano: 22.0, grande: 30.0 },
  // For combination fillings we will fallback to using the highest priced component
  'nata, trufa': { mini: 14.0, pequeño: 18.0, mediano: 20.0, grande: 25.0 },
  'nata, crema': { mini: 12.0, pequeño: 15.0, mediano: 18.0, grande: 22.0 },
  'nata, chocolate': { mini: 16.0, pequeño: 20.0, mediano: 22.0, grande: 30.0 },
  'trufa, crema': { mini: 14.0, pequeño: 18.0, mediano: 20.0, grande: 25.0 },
  'trufa, chocolate': { mini: 16.0, pequeño: 20.0, mediano: 22.0, grande: 30.0 },
  'crema, chocolate': { mini: 16.0, pequeño: 20.0, mediano: 22.0, grande: 30.0 },
  'nata, trufa, crema': { mini: 14.0, pequeño: 18.0, mediano: 20.0, grande: 25.0 },
  'nata, trufa, chocolate': { mini: 16.0, pequeño: 20.0, mediano: 22.0, grande: 30.0 },
  'nata, crema, chocolate': { mini: 16.0, pequeño: 20.0, mediano: 22.0, grande: 30.0 },
  'trufa, crema, chocolate': { mini: 16.0, pequeño: 20.0, mediano: 22.0, grande: 30.0 },
};

export function getUnitPrice(filling: RosconFilling, size: RosconSize) {
  // If exact mapping exists, return it
  const byFilling = (PRICE_TABLE as any)[filling];
  if (byFilling && byFilling[size] !== undefined) {
    return byFilling[size];
  }

  // For complex combinations not explicitly listed, choose highest of components
  const components = filling.split(',').map(s => s.trim());
  let max = 0;
  for (const comp of components) {
    const compKey = comp as RosconFilling;
    const compTable = (PRICE_TABLE as any)[compKey];
    if (compTable && compTable[size] !== undefined) {
      max = Math.max(max, compTable[size]);
    }
  }
  return max || 0;
}
