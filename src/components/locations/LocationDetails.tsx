import { MapPin, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface LocationDetailsProps {
    location: {
        id: string;
        name: string;
        description?: string;
        totalPrice?: number;
        createdAt: string;
        parent?: { id: string; name: string };
    };
    itemCount: number;
    onEdit: () => void;
    onAddChild: () => void;
    onDelete: () => void;
}

/**
 * LocationDetails Component
 * Displays detailed information about a selected location
 */
export function LocationDetails({
    location,
    itemCount,
    onEdit,
    onAddChild,
    onDelete
}: LocationDetailsProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            {/* Header with Actions */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
                        <MapPin className="w-7 h-7 text-teal-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 mb-1">{location.name}</h1>
                        {location.parent && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Home
                                <ChevronRight className="w-3 h-3" />
                                {location.parent.name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md flex items-center gap-1.5 transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                        onClick={onAddChild}
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-blue-300 hover:bg-blue-50 rounded-md flex items-center gap-1.5 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Child
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 hover:bg-red-50 rounded-md flex items-center gap-1.5 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>

            {/* Description */}
            {location.description && (
                <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{location.description}</p>
                </div>
            )}

            {/* Statistics Grid */}
            <div className="grid grid-cols-3 gap-8 pt-6 border-t border-gray-100">
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Items</p>
                    <p className="text-2xl font-semibold text-gray-900">{itemCount}</p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Value</p>
                    <p className="text-2xl font-semibold text-gray-900">
                        ${location.totalPrice?.toLocaleString() || '0'}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created</p>
                    <p className="text-base text-gray-900">
                        {format(new Date(location.createdAt), 'MMM d, yyyy')}
                    </p>
                </div>
            </div>
        </div>
    );
}
