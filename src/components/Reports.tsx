import { useMemo, useState, useEffect } from 'react';
import { Order, ROSCON_SIZES, ROSCON_FILLINGS } from '../types';
import { BarChart3, Download, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface ReportsProps {
  orders: Order[];
}

export function Reports({ orders }: ReportsProps) {
  const reportData = useMemo(() => {
    // Total production needed by size and filling
    const productionBySize = ROSCON_SIZES.reduce((acc, size) => {
      acc[size] = orders
        .filter(o => o.size === size && o.status !== 'entregado')
        .reduce((sum, o) => sum + o.quantity, 0);
      return acc;
    }, {} as Record<string, number>);

    const productionByFilling = ROSCON_FILLINGS.reduce((acc, filling) => {
      acc[filling] = orders
        .filter(o => o.filling === filling && o.status !== 'entregado')
        .reduce((sum, o) => sum + o.quantity, 0);
      return acc;
    }, {} as Record<string, number>);

    // Combined production matrix
    const productionMatrix: Record<string, Record<string, number>> = {};
    ROSCON_SIZES.forEach(size => {
      productionMatrix[size] = {};
      ROSCON_FILLINGS.forEach(filling => {
        productionMatrix[size][filling] = orders
          .filter(o => o.size === size && o.filling === filling && o.status !== 'entregado')
          .reduce((sum, o) => sum + o.quantity, 0);
      });
    });

    // Orders by delivery date
    const ordersByDate = orders.reduce((acc, order) => {
      if (!acc[order.deliveryDate]) {
        acc[order.deliveryDate] = {
          orders: 0,
          roscones: 0,
          revenue: 0,
        };
      }
      acc[order.deliveryDate].orders++;
      acc[order.deliveryDate].roscones += order.quantity;
      acc[order.deliveryDate].revenue += order.price;
      return acc;
    }, {} as Record<string, { orders: number; roscones: number; revenue: number }>);

    // Total stats
    const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);
    const totalRoscones = orders.reduce((sum, o) => sum + o.quantity, 0);
    const pendingProduction = orders
      .filter(o => o.status !== 'entregado')
      .reduce((sum, o) => sum + o.quantity, 0);

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

  const [selectOpen, setSelectOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  const handleExportCSV = (filterOrders?: typeof orders) => {
    const target = filterOrders || orders;
    const headers = ['Cliente', 'Teléfono', 'Tamaño', 'Relleno', 'Cantidad', 'Precio', 'Fecha Entrega', 'Estado', 'Pagado', 'Método Pago', 'Notas'];
    const rows = target.map(o => [
      o.customerName,
      o.phone,
      o.size,
      o.filling,
      o.quantity,
      o.price.toFixed(2),
      o.deliveryDate,
      o.status,
      o.paid ? 'Sí' : 'No',
      o.paymentMethod || 'N/A',
      o.notes || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedidos-roscones-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generateProductionText = () => {
    let content = 'PLAN DE PRODUCCIÓN DE ROSCONES\n';
    content += '='.repeat(50) + '\n\n';

    content += 'PRODUCCIÓN PENDIENTE POR TAMAÑO:\n';
    Object.entries(reportData.productionBySize).forEach(([size, count]) => {
      if (count > 0) {
        content += `${size.toUpperCase()}: ${count} unidades\n`;
      }
    });

    content += '\nPRODUCCIÓN PENDIENTE POR RELLENO:\n';
    Object.entries(reportData.productionByFilling).forEach(([filling, count]) => {
      if (count > 0) {
        content += `${filling.toUpperCase()}: ${count} unidades\n`;
      }
    });

    content += '\n' + '='.repeat(50) + '\n';
    content += 'MATRIZ DE PRODUCCIÓN (Tamaño x Relleno):\n';
    content += '='.repeat(50) + '\n\n';

    ROSCON_SIZES.forEach(size => {
      let hasProduction = false;
      let line = `${size.toUpperCase()}:\n`;
      ROSCON_FILLINGS.forEach(filling => {
        const count = reportData.productionMatrix[size][filling];
        if (count > 0) {
          line += `  - ${filling}: ${count} unidades\n`;
          hasProduction = true;
        }
      });
      if (hasProduction) {
        content += line + '\n';
      }
    });

    return content;
  };

  const handleExportProduction = () => {
    const content = generateProductionText();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `produccion-roscones-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Bluetooth printing moved to `src/utils/bluetooth.ts` and usage has been moved to the Orders section (OrderList).







  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-gray-900 mb-2">Plan de Producción</h2>
          <p className="text-gray-600">Informe detallado de roscones a producir</p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleExportProduction}
            className="btn btn-lg px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all flex items-center gap-2 shadow-md"
          >
            <Download className="w-5 h-5" />
            Plan Producción
          </button>



          <button
            onClick={() => {
              const selected = Object.keys(selectedIds).filter(id => selectedIds[id]);
              if (selected.length === 0) {
                setSelectOpen(true);
              } else {
                const target = orders.filter(o => selected.includes(o.id));
                handleExportCSV(target);
              }
            }}
            className="btn btn-lg px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
        </div>

        {/* Selector modal (centered) */}
        {selectOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSelectOpen(false)}></div>
            <div className="relative bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg z-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Seleccionar Pedidos</h3>
                <div className="flex gap-2">
                  <button onClick={() => { const all: Record<string, boolean> = {}; orders.forEach(o => all[o.id] = true); setSelectedIds(all); }} className="btn small px-3 py-2 bg-gray-100 rounded">Seleccionar todos</button>
                  <button onClick={() => { setSelectedIds({}); }} className="btn small px-3 py-2 bg-gray-100 rounded">Limpiar</button>
                  <button onClick={() => setSelectOpen(false)} className="btn small px-3 py-2 bg-red-50 rounded">Cerrar</button>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto border-t border-gray-100 pt-3">
                {orders.map(o => (
                  <label key={o.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <input type="checkbox" checked={!!selectedIds[o.id]} onChange={(e) => setSelectedIds(prev => ({ ...prev, [o.id]: e.target.checked }))} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{o.customerName} — {o.quantity} × {o.size} ({o.filling})</div>
                      <div className="text-xs text-gray-500">{o.phone} • {o.deliveryDate} • €{o.price.toFixed(2)}</div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-1 mt-4 items-center">
                <div className="flex gap-1">
                  <button onClick={() => { const selected = Object.keys(selectedIds).filter(id => selectedIds[id]); if (selected.length === 0) { alert('Selecciona al menos un pedido'); return; } handleExportCSV(orders.filter(o => selected.includes(o.id))); }} className="btn small px-3 py-2 bg-green-600 text-white rounded">Exportar CSV</button>
                </div>
                <div className="flex-1" />
                <button onClick={() => { setSelectOpen(false); }} className="btn small px-3 py-2 bg-gray-100 rounded">Cerrar</button>
              </div>
            </div>
          </div>
        )}



      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-gray-600 mb-1">Total Roscones</p>
          <p className="text-gray-900">{reportData.totalRoscones} unidades</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 text-yellow-500" />
          </div>
          <p className="text-gray-600 mb-1">Pendientes de Producir</p>
          <p className="text-gray-900">{reportData.pendingProduction} unidades</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-gray-600 mb-1">Ingresos Totales</p>
          <p className="text-gray-900">€{reportData.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Production by Size */}
      <div className="bg-white rounded-xl p-6 border border-orange-100">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-6 h-6 text-orange-600" />
          <h3 className="text-gray-900">Producción Pendiente por Tamaño</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROSCON_SIZES.map(size => (
            <div
              key={size}
              className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200"
            >
              <p className="text-gray-700 capitalize mb-2">{size}</p>
              <p className="text-gray-900">{reportData.productionBySize[size]} unidades</p>
            </div>
          ))}
        </div>
      </div>

      {/* Production by Filling */}
      <div className="bg-white rounded-xl p-6 border border-orange-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-orange-600" />
          <h3 className="text-gray-900">Producción Pendiente por Relleno</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ROSCON_FILLINGS.map(filling => (
            <div
              key={filling}
              className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200"
            >
              <p className="text-gray-700 capitalize mb-2">{filling}</p>
              <p className="text-gray-900">{reportData.productionByFilling[filling]} unidades</p>
            </div>
          ))}
        </div>
      </div>

      {/* Production Matrix */}
      <div className="bg-white rounded-xl p-6 border border-orange-100">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-6 h-6 text-orange-600" />
          <h3 className="text-gray-900">Matriz de Producción (Tamaño × Relleno)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-orange-200">
                <th className="text-left py-3 px-4 text-gray-700">Tamaño / Relleno</th>
                {ROSCON_FILLINGS.map(filling => (
                  <th key={filling} className="text-center py-3 px-4 text-gray-700 capitalize">
                    {filling}
                  </th>
                ))}
                <th className="text-right py-3 px-4 text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {ROSCON_SIZES.map(size => (
                <tr key={size} className="border-b border-orange-100 hover:bg-orange-50">
                  <td className="py-3 px-4 text-gray-900 capitalize">{size}</td>
                  {ROSCON_FILLINGS.map(filling => (
                    <td key={filling} className="py-3 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full ${
                        reportData.productionMatrix[size][filling] > 0
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-400'
                      }`}>
                        {reportData.productionMatrix[size][filling] || '-'}
                      </span>
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right text-gray-900">
                    {reportData.productionBySize[size]}
                  </td>
                </tr>
              ))}
              <tr className="bg-orange-50">
                <td className="py-3 px-4 text-gray-900">Total</td>
                {ROSCON_FILLINGS.map(filling => (
                  <td key={filling} className="py-3 px-4 text-center text-gray-900">
                    {reportData.productionByFilling[filling]}
                  </td>
                ))}
                <td className="py-3 px-4 text-right text-gray-900">
                  {reportData.pendingProduction}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders by Delivery Date */}
      <div className="bg-white rounded-xl p-6 border border-orange-100">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-6 h-6 text-orange-600" />
          <h3 className="text-gray-900">Pedidos por Fecha de Entrega</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-orange-200">
                <th className="text-left py-3 px-4 text-gray-700">Fecha</th>
                <th className="text-right py-3 px-4 text-gray-700">Pedidos</th>
                <th className="text-right py-3 px-4 text-gray-700">Roscones</th>
                <th className="text-right py-3 px-4 text-gray-700">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(reportData.ordersByDate)
                .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                .map(([date, data]) => (
                  <tr key={date} className="border-b border-orange-100 hover:bg-orange-50">
                    <td className="py-3 px-4 text-gray-900">
                      {new Date(date).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">{data.orders}</td>
                    <td className="py-3 px-4 text-right text-gray-900">{data.roscones}</td>
                    <td className="py-3 px-4 text-right text-gray-900">€{data.revenue.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}