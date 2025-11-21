import { Home, ClipboardList, BarChart3, Plus } from 'lucide-react';

type View = 'dashboard' | 'orders' | 'reports';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onNewOrder: () => void;
}

export function Navigation({ currentView, onViewChange, onNewOrder }: NavigationProps) {
  return (
    <header className="bg-white border-b border-orange-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white"></span>
            </div>
            <div>
              <h1 className="text-orange-600">Panadería Bollería Pedro Rodriguez Barrios</h1>
              <p className="text-orange-500 text-xs">Gestión de Pedidos de Roscones</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavButton
              icon={<Home className="w-5 h-5" />}
              label="Inicio"
              active={currentView === 'dashboard'}
              onClick={() => onViewChange('dashboard')}
            />
            <NavButton
              icon={<ClipboardList className="w-5 h-5" />}
              label="Pedidos"
              active={currentView === 'orders'}
              onClick={() => onViewChange('orders')}
            />
            <NavButton
              icon={<BarChart3 className="w-5 h-5" />}
              label="Producción"
              active={currentView === 'reports'}
              onClick={() => onViewChange('reports')}
            />
            <button
              onClick={onNewOrder}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all flex items-center gap-2 shadow-md"
            >
              <Plus className="w-5 h-5" />
              Nuevo Pedido
            </button>
          </nav>

          {/* Mobile Add Button */}
          <button
            onClick={onNewOrder}
            className="md:hidden p-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all shadow-md"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-around pb-3 gap-2">
          <NavButton
            icon={<Home className="w-5 h-5" />}
            label="Inicio"
            active={currentView === 'dashboard'}
            onClick={() => onViewChange('dashboard')}
            mobile
          />
          <NavButton
            icon={<ClipboardList className="w-5 h-5" />}
            label="Pedidos"
            active={currentView === 'orders'}
            onClick={() => onViewChange('orders')}
            mobile
          />
          <NavButton
            icon={<BarChart3 className="w-5 h-5" />}
            label="Producción"
            active={currentView === 'reports'}
            onClick={() => onViewChange('reports')}
            mobile
          />
        </nav>
      </div>
    </header>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  mobile?: boolean;
}

function NavButton({ icon, label, active, onClick, mobile }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        ${mobile ? 'flex-col py-1 px-4' : 'flex-row py-2 px-4'}
        flex items-center justify-center gap-2 rounded-lg transition-colors
        ${active 
          ? 'bg-orange-50 text-orange-600' 
          : 'text-gray-600 hover:bg-orange-50/50'
        }
      `}
    >
      {icon}
      <span className={mobile ? 'text-xs' : ''}>{label}</span>
    </button>
  );
}
