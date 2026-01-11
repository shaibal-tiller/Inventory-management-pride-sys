import { X, Upload } from 'lucide-react';

interface AttachmentUploadModalProps {
    isOpen: boolean;
    uploading: boolean;
    onClose: () => void;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * AttachmentUploadModal Component
 * File upload modal for adding attachments
 */
export function AttachmentUploadModal({ isOpen, uploading, onClose, onFileSelect }: AttachmentUploadModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Add Attachment</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                    Upload photos, documents, or receipts for this item.
                </p>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
                    <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={onFileSelect}
                            accept="image/*,application/pdf"
                            disabled={uploading}
                        />
                        <label
                            htmlFor="file-upload"
                            className={`inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-blue-700 ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {uploading ? 'Uploading...' : 'Choose File'}
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                            PNG, JPG or PDF up to 10MB
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
