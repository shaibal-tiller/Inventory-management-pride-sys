import { Plus, X, Filter } from 'lucide-react';

interface InventoryFiltersProps {
    itemCount: number;
}

/**
 * InventoryFilters Component
 * Displays active filters and sort options
 */
export function InventoryFilters({ itemCount }: InventoryFiltersProps) {
    return (
        <div className="px-6 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filters:</span>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md">
                    All Locations
                    <X className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md">
                    In Stock
                    <X className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                    <Plus className="w-3 h-3" />
                    Add Filter
                </button>
                <div className="ml-auto flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                        <Filter className="w-4 h-4" />
                        Sort: Updated
                    </button>
                </div>
            </div>
        </div>
    );
}
