import { format } from 'date-fns';

interface ItemDetailsTabProps {
    item: {
        manufacturer?: string;
        modelNumber?: string;
        serialNumber?: string;
        purchaseFrom?: string;
        updatedAt?: string;
    };
}

/**
 * ItemDetailsTab Component
 * Displays product information and additional details
 */
export function ItemDetailsTab({ item }: ItemDetailsTabProps) {
    return (
        <div className="grid grid-cols-2 gap-8">
            {/* Product Information */}
            <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Product Information</h4>
                <div className="space-y-3">
                    <div>
                        <p className="text-xs text-gray-500">Brand</p>
                        <p className="text-sm font-medium text-gray-900">{item.manufacturer || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Model</p>
                        <p className="text-sm font-medium text-gray-900">{item.modelNumber || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Color</p>
                        <p className="text-sm font-medium text-gray-900">N/A</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Condition</p>
                        <p className="text-sm font-medium text-gray-900">N/A</p>
                    </div>
                </div>
            </div>

            {/* Additional Details */}
            <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Additional Details</h4>
                <div className="space-y-3">
                    <div>
                        <p className="text-xs text-gray-500">Serial Number</p>
                        <p className="text-sm font-medium text-gray-900">{item.serialNumber || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Purchased From</p>
                        <p className="text-sm font-medium text-gray-900">{item.purchaseFrom || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Last Updated</p>
                        <p className="text-sm font-medium text-gray-900">
                            {item.updatedAt ? format(new Date(item.updatedAt), 'MMMM d, yyyy, h:mm a') : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
