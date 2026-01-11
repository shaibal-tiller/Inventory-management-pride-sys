import { MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ItemKeyDetailsProps {
    item: {
        location?: { name: string };
        labels?: any[];
        quantity: number;
        purchaseTime?: string;
        purchasePrice?: number;
        warrantyExpires?: string;
        notes?: string;
    };
}

/**
 * ItemKeyDetails Component
 * Displays key information sidebar for the item
 */
export function ItemKeyDetails({ item }: ItemKeyDetailsProps) {
    return (
        <div className="bg-gray-50 rounded-lg p-6 h-[51vh] overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Key Details</h3>
            <div className="space-y-4">
                {/* Location */}
                <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        {item.location?.name || 'N/A'}
                    </p>
                </div>

                {/* Labels */}
                <div>
                    <p className="text-xs text-gray-500 mb-1">Labels</p>
                    <div className="flex flex-wrap gap-1.5">
                        {item.labels && item.labels.length > 0 ? (
                            item.labels.map((label: any) => (
                                <span
                                    key={label.id}
                                    className="px-2 py-0.5 rounded text-xs font-medium"
                                    style={{
                                        backgroundColor: `${label.color}20`,
                                        color: label.color
                                    }}
                                >
                                    {label.name}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-gray-900">N/A</span>
                        )}
                    </div>
                </div>

                {/* Quantity */}
                <div>
                    <p className="text-xs text-gray-500 mb-1">Quantity</p>
                    <p className="text-sm text-gray-900">{item.quantity}</p>
                </div>

                {/* Purchase Date */}
                {item.purchaseTime && (
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Purchase Date</p>
                        <p className="text-sm text-gray-900 flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {format(new Date(item.purchaseTime), 'MMMM d, yyyy')}
                        </p>
                    </div>
                )}

                {/* Purchase Price */}
                {item.purchasePrice !== null && item.purchasePrice !== undefined && (
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Purchase Price</p>
                        <p className="text-xl font-semibold text-gray-900">
                            ${item.purchasePrice.toFixed(2)}
                        </p>
                    </div>
                )}

                {/* Warranty */}
                {item.warrantyExpires && (
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Warranty</p>
                        <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                            Active until {format(new Date(item.warrantyExpires), 'MMMM d, yyyy')}
                        </span>
                    </div>
                )}

                {/* Notes */}
                {item.notes && (
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Notes</p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {item.notes}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
