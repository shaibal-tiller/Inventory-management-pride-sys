interface ItemEditFormProps {
    formData: {
        name: string;
        description: string;
        quantity: number;
        purchasePrice: number;
        notes: string;
    };
    onFormChange: (data: any) => void;
}

/**
 * ItemEditForm Component
 * Form for editing item details
 */
export function ItemEditForm({ formData, onFormChange }: ItemEditFormProps) {
    return (
        <div className="space-y-4 max-w-3xl">
            {/* Name Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            {/* Description Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            {/* Quantity and Price */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => onFormChange({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                    <input
                        type="number"
                        value={formData.purchasePrice}
                        onChange={(e) => onFormChange({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        step="0.01"
                    />
                </div>
            </div>

            {/* Notes Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => onFormChange({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24"
                />
            </div>
        </div>
    );
}
