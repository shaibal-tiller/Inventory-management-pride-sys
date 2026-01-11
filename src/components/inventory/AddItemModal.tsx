import { X, Upload } from 'lucide-react';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: {
        name: string;
        description: string;
        quantity: number;
        purchasePrice: number;
        notes: string;
        locationId: string;
        labelIds: string[];
    };
    onFormChange: (data: any) => void;
    onSubmit: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    uploading: boolean;
    locations: any[];
    attachmentFile: File | null;
}

/**
 * AddItemModal Component
 * Modal for creating new inventory items
 */
export function AddItemModal({
    isOpen,
    onClose,
    formData,
    onFormChange,
    onSubmit,
    onFileChange,
    uploading,
    locations,
    attachmentFile
}: AddItemModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Add New Item</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Item Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="Enter item name..."
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="Enter description..."
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                min="1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                            <input
                                type="number"
                                value={formData.purchasePrice}
                                onChange={(e) => onFormChange({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                step="0.01"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <select
                            value={formData.locationId}
                            onChange={(e) => onFormChange({ ...formData, locationId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        >
                            <option value="">Select a location</option>
                            {locations.map((location) => (
                                <option key={location.id} value={location.id}>
                                    {location.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => onFormChange({ ...formData, notes: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24"
                            placeholder="Add any additional notes..."
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <input
                                type="file"
                                id="add-file-upload"
                                className="hidden"
                                onChange={onFileChange}
                                accept="image/*,application/pdf"
                            />
                            <label
                                htmlFor="add-file-upload"
                                className="inline-block px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50"
                            >
                                Choose File
                            </label>
                            {attachmentFile && (
                                <p className="text-sm text-gray-600 mt-2">{attachmentFile.name}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                                PNG, JPG or PDF up to 10MB
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={!formData.name || uploading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Adding...' : 'Add Item'}
                    </button>
                </div>
            </div>
        </div>
    );
}
