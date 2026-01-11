import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { API_BASE_URL } from '../../lib/api';

interface LocationItemsListProps {
    items: any[];
    onAddItem: () => void;
    attachmentToken: string | null;
}

/**
 * LocationItemsList Component
 * Displays items within a location
 */
export function LocationItemsList({ items, onAddItem, attachmentToken }: LocationItemsListProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-base font-semibold text-gray-900">Items in this Location</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Items List */}
            <div className="p-4 space-y-3">
                {items.map((item: any) => (
                    <div
                        key={item.id}
                        onClick={() => navigate(`/items/${item.id}`)}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer group border border-gray-200 rounded-lg transition-colors"
                    >
                        {/* Item Thumbnail */}
                        <div className="w-12 h-12 bg-purple-100 rounded-lg overflow-hidden shrink-0">
                            {item.thumbnailId ? (
                                <img
                                    src={`${API_BASE_URL}/v1/items/${item.id}/attachments/${item.thumbnailId}?token=${attachmentToken}`}
                                    className="w-full h-full object-cover"
                                    alt=""
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 to-purple-300">
                                    <Package className="w-6 h-6 text-purple-600" />
                                </div>
                            )}
                        </div>

                        {/* Item Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate mb-0.5">
                                {item.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {item.labels[0]?.name || 'General'} • Added {format(new Date(item.updatedAt), 'MMM d, yyyy')}
                            </p>
                        </div>

                        {/* Item Price */}
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                                ${item.purchasePrice?.toLocaleString() || '—'}
                            </p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-medium">
                                Good
                            </span>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {(!items || items.length === 0) && (
                    <div className="py-12 text-center">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No items in this location</p>
                    </div>
                )}
            </div>

            {/* Add Item Button */}
            <div className="border-t border-gray-200 px-4 py-3">
                <button
                    onClick={onAddItem}
                    className="w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 font-medium flex items-center justify-center gap-2 rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Item to this Location
                </button>
            </div>
        </div>
    );
}
