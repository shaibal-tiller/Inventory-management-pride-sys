import { Link, useLocation } from 'react-router-dom';
import { Package, Home, MapPin, Tag, TrendingUp, Settings, MoreVertical } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: MapPin, label: 'Locations', path: '/locations' },
    { icon: Tag, label: 'Labels', path: '/labels' },
    { icon: TrendingUp, label: 'Reports', path: '/reports' },
];

export function Sidebar() {
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-xl shadow-md flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-slate-900">Home Inventory</h1>
                        <p className="text-xs text-slate-500">Manage your items</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-primary-600'
                                    : 'text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}

                {/* Divider */}
                <div className="pt-4 mt-4 border-t border-slate-200">
                    <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                    </Link>
                </div>
            </nav>

            {/* User Profile */}
            <div className="px-4 py-4 border-t border-slate-200">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-slate-900 truncate">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                            {user?.email || 'user@example.com'}
                        </p>
                    </div>
                    <button className="p-1 hover:bg-slate-100 rounded">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                </div>
            </div>
        </aside>
    );
}