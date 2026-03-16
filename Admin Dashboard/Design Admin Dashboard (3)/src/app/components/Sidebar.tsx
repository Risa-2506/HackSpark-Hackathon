import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  History, 
  Settings,
  Shield
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Shopkeepers', href: '/shopkeepers', icon: Store },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Transaction History', href: '/transactions', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center gap-2 border-b border-gray-800 px-6">
        <Shield className="h-8 w-8 text-green-500" />
        <div>
          <h1 className="text-lg font-bold">Ration Guard</h1>
          <p className="text-xs text-gray-400">Anti-Fraud System</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <div className="rounded-lg bg-gray-800 p-3">
          <p className="text-xs font-medium text-gray-400">Admin Panel</p>
          <p className="text-sm font-semibold">Government Official</p>
        </div>
      </div>
    </div>
  );
}
