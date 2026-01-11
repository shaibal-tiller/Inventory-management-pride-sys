import { X } from 'lucide-react';

interface LocationModalProps {
    isOpen: boolean;
    type: 'create' | 'edit' | 'add-item' | 'delete' | null;
    onClose: () => void;
    onSubmit: () => void;
    formData: {
        name: string;
        description: string;
        quantity: number;
        purchasePrice: number;
    };
    onFormChange: (data: any) => void;
    locationName?: string;
}

/**
 * LocationModal Component
 * Handles create, edit, delete, and add-item modals for locations
 */
export function LocationModal({
    isOpen,
    type,
    onClose,
    onSubmit,
    formData,
    onFormChange,
    locationName
}: LocationModalProps) {
    if (!isOpen || !type) return null;

    const isDeleteModal = type === 'delete';
    const isAddItemModal = type === 'add-item';

    const getTitle = () => {
        switch (type) {
            case 'delete': return 'Delete Location';
            case 'add-item': return 'Add Item';
            case 'edit': return 'Edit Location';
            default: return 'New Location';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {getTitle()}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Content */}
                {isDeleteModal ? (
                    <div>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete "{locationName}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSubmit}
                                className="flex-1 py-2.5 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="space-y-4">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    value={formData.name}
                                    onChange={e => onFormChange({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                    placeholder="Enter name..."
                                />
                            </div>

                            {/* Description Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => onFormChange({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm h-24 resize-none"
                                    placeholder="Optional details..."
                                />
                            </div>

                            {/* Additional Fields for Add Item */}
                            {isAddItemModal && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                        <input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={e => onFormChange({ ...formData, quantity: parseInt(e.target.value) })}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                                        <input
                                            type="number"
                                            step="1"
                                            value={formData.purchasePrice}
                                            onChange={e => onFormChange({ ...formData, purchasePrice: Number(e.target.value) })}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={onSubmit}
                            className="w-full mt-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            {type === 'edit' ? 'Update' : 'Create'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
