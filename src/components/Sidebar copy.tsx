// src/components/Sidebar.tsx
import { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    MapPin,
    Settings,
    LogOut,
    User,
    MoreVertical,
    Tag,
    BarChart3
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export  function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close profile menu on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navigationItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard, disabled: false },
        { name: 'Inventory', href: '/inventory', icon: Package, disabled: false },
        { name: 'Locations', href: '/locations', icon: MapPin, disabled: false },
        { name: 'Labels', href: '#', icon: Tag, disabled: true },
        { name: 'Reports', href: '#', icon: BarChart3, disabled: true },
    ];

    const secondaryItems = [
        { name: 'Settings', href: '#', icon: Settings, disabled: true },
    ];

    const isInventoryActive = location.pathname.startsWith('/inventory');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavLink = ({ item }: { item: typeof navigationItems[0] }) => {
        // Hide Dashboard specifically when on any /inventory path
        if (item.name === 'Dashboard' && isInventoryActive) return null;

        const isActive = location.pathname === item.href;

        return (
            <Link
                to={item.href}
                onClick={(e) => item.disabled && e.preventDefault()}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
            >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                {item.name}
            </Link>
        );
    };

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">Inventory</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => (
                    <NavLink key={item.name} item={item} />
                ))}

                {/* Separation Bar */}
                <div className="my-4 border-t border-slate-100 mx-2" />

                {secondaryItems.map((item) => (
                    <NavLink key={item.name} item={item} />
                ))}
            </nav>

            {/* Profile Section */}
            <div className="p-4 border-t border-slate-100 relative" ref={menuRef}>
                {isProfileOpen && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => { setIsProfileOpen(false); navigate('/profile'); }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                <User className="w-4 h-4 text-slate-400" />
                                Your Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign out
                            </button>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 ${isProfileOpen ? 'bg-slate-50' : 'hover:bg-slate-50'
                        }`}
                >
                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
            </div>
        </aside>
    );
}