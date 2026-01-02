import { useMemo } from 'react';
import {
  Order,
  RosconItem,
  RosconSize,
  RosconFilling,
  ROSCON_SIZES,
  ROSCON_FILLINGS,
} from '../types';
import { BarChart3, Download, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface ReportsProps {
  orders: Order[];
}

export function Reports({ orders }: ReportsProps) {
  const reportData = useMemo(() => {
    const getRosconesFromOrder = (order: Order): RosconItem[] => {
      if (order.items && order.items.length > 0) {
        return order.items;
      }
      if (order.size && order.filling != null && order.quantity != null) {
        return [
          {
            size: order.size,
            filling: order.filling,
            quantity: order.quantity,
            unitPrice: order.price / (order.quantity || 1),
            total: order.price,
          },
        ];
      }
      return [];
    };

    // Inicializar con todas las claves
    const productionBySize = ROSCON_SIZES.reduce(
      (acc, size) => {
        acc[size] = 0;
        return acc;
      },
      {} as Record<RosconSize, number>
    );

    const productionByFilling = ROSCON_FILLINGS.reduce(
      (acc, filling) => {
        acc[filling] = 0;
        return acc;
      },
      {} as Record<RosconFilling, number>
    );

    // Llenar valores
    const pendingItems = orders
      .filter(o => o.status !== 'entregado')
      .flatMap(getRosconesFromOrder);

    pendingItems.forEach(item => {
      productionBySize[item.size] += item.quantity;
      productionByFilling[item.filling] += item.quantity;
    });

    // Matriz producción por tamaño y relleno
    const productionMatrix = ROSCON_SIZES.reduce(
      (matrix, size) => {
        matrix[size] = ROSCON_FILLINGS.reduce(
          (fillMap, filling) => {
            fillMap[filling] = 0;
            return fillMap;
          },
          {} as Record<RosconFilling, number>
        );
        return matrix;
      },
      {} as Record<RosconSize, Record<RosconFilling, number>>
    );

    pendingItems.forEach(item => {
      productionMatrix[item.size][item.filling] += item.quantity;
    });

    const ordersByDate = orders.reduce((acc, order) => {
      if (!acc[order.deliveryDate]) {
        acc[order.deliveryDate] = { orders: 0, roscones: 0, revenue: 0 };
      }
      acc[order.deliveryDate].orders++;
      acc[order.deliveryDate].roscones += getRosconesFromOrder(order).reduce((sum, i) => sum + i.quantity, 0);
      acc[order.deliveryDate].revenue += order.price;
      return acc;
    }, {} as Record<string, { orders: number; roscones: number; revenue: number }>);

    const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);
    const totalRoscones = orders.flatMap(getRosconesFromOrder).reduce((sum, i) => sum + i.quantity, 0);
    const pendingProduction = pendingItems.reduce((sum, i) => sum + i.quantity, 0);

    return {
      productionBySize,
      productionByFilling,
      productionMatrix,
      ordersByDate,
      totalRevenue,
      totalRoscones,
      pendingProduction,
    };
  }, [orders]);

  return (
    <div className="space-y-6">
      <h2 className="text-gray-900 text-xl font-bold">Resumen de Producción</h2>

      {/* Producción por Tamaño */}
      <div className="bg-white rounded-xl p-4 border border-orange-100">
        <h3 className="text-gray-800 font-medium mb-2">Roscones por Tamaño</h3>
        {ROSCON_SIZES.map(size => (
          <div key={size} className="flex justify-between">
            <span className="capitalize">{size}</span>
            <span>{reportData.productionBySize[size]} unidades</span>
          </div>
        ))}
      </div>

      {/* Producción por Relleno */}
      <div className="bg-white rounded-xl p-4 border border-orange-100">
        <h3 className="text-gray-800 font-medium mb-2">Roscones por Relleno</h3>
        {ROSCON_FILLINGS.map(filling => (
          <div key={filling} className="flex justify-between">
            <span className="capitalize">{filling}</span>
            <span>{reportData.productionByFilling[filling]} unidades</span>
          </div>
        ))}
      </div>

      {/* Producción pendiente */}
      <div className="bg-white rounded-xl p-4 border border-orange-100">
        <h3 className="text-gray-800 font-medium mb-2">Producción Pendiente</h3>
        <p>{reportData.pendingProduction} roscones por preparar</p>
      </div>

      {/* Totales generales */}
      <div className="bg-white rounded-xl p-4 border border-orange-100">
        <h3 className="text-gray-800 font-medium mb-2">Totales</h3>
        <p>Total de Roscones: {reportData.totalRoscones}</p>
        <p>Ingresos Totales: €{reportData.totalRevenue.toFixed(2)}</p>
      </div>
    </div>
  );
}
