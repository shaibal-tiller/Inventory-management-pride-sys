import type { ReactNode } from "react";
import { Sidebar } from './Sidebar.tsx';
import { Bell, HelpCircle } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
    header?: ReactNode;
    showHeaderIcons?: boolean;
}

export function Layout({ children, header, showHeaderIcons = true }: LayoutProps) {
    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {header ? (
                    <header className="bg-white border-b border-gray-200">
                        <div className="flex items-center justify-between h-full">
                            <div className="flex-1">{header}</div>
                            {showHeaderIcons && (
                                <div className="flex items-center gap-3 px-6">
                                    <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                                        <Bell className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                                        <HelpCircle className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>
                ) : (
                    showHeaderIcons && (
                        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6 gap-3">
                            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                                <Bell className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                                <HelpCircle className="w-5 h-5 text-gray-600" />
                            </button>
                        </header>
                    )
                )}
                <main className="flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}