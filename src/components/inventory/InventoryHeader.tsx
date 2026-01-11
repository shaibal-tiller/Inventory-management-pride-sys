import { Search, Download, Plus } from 'lucide-react';

interface InventoryHeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onAddItem: () => void;
    itemCount: number;
}

/**
 * InventoryHeader Component
 * Displays search bar, item count, and action buttons
 */
export function InventoryHeader({ searchQuery, onSearchChange, onAddItem, itemCount }: InventoryHeaderProps) {
    return (
        <div className="px-6 py-5">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 max-w-3xl">
                    <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{itemCount} items</span>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={onAddItem}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Item
                    </button>
                </div>
            </div>
        </div>
    );
}
