import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ChevronRight, Edit, Trash2, Plus, MapPin, Calendar,
    Package, Paperclip, Activity, X, Upload
} from 'lucide-react';
import { api, API_BASE_URL } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { format } from 'date-fns';

export default function ItemDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { attachmentToken } = useAuthStore();

    const [activeTab, setActiveTab] = useState<'details' | 'attachments' | 'activity'>('details');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        quantity: 1,
        purchasePrice: 0,
        notes: '',
        manufacturer: '',
        modelNumber: '',
        serialNumber: '',
        purchaseFrom: ''
    });
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

    const { data: item, isLoading, error } = useQuery({
        queryKey: ['item', id],
        queryFn: () => (id ? api.getItem(id) : null),
        enabled: !!id,
    });

    const deleteMutation = useMutation({
        mutationFn: () => api.deleteItem(id!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
            navigate('/inventory');
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: any) => api.updateItem(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['item', id] });
            queryClient.invalidateQueries({ queryKey: ['items'] });
            setIsEditMode(false);
        }
    });

    const uploadMutation = useMutation({
        mutationFn: (file: File) => api.uploadAttachment(id!, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['item', id] });
            setIsAttachmentModalOpen(false);
            setUploading(false);
        }
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploading(true);
            uploadMutation.mutate(file);
        }
    };

    const handleEdit = () => {
        if (item) {
            setEditFormData({
                name: item.name,
                description: item.description || '',
                quantity: item.quantity,
                purchasePrice: item.purchasePrice || 0,
                notes: item.notes || '',
                manufacturer: item.manufacturer || '',
                modelNumber: item.modelNumber || '',
                serialNumber: item.serialNumber || '',
                purchaseFrom: item.purchaseFrom || ''
            });
            setIsEditMode(true);
        }
    };

    const handleSaveEdit = () => {
        updateMutation.mutate(editFormData);
    };

    const handleDelete = () => {
        deleteMutation.mutate();
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <LoadingSpinner />
                </div>
            </Layout>
        );
    }

    if (error || !item) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Failed to load item</p>
                        <button
                            onClick={() => navigate('/inventory')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Back to Inventory
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const currentImageId = selectedImageId || item.imageId;
    const getImageUrl = (attachmentId: string) =>
        `${API_BASE_URL}/v1/items/${item.id}/attachments/${attachmentId}?token=${attachmentToken}`;

    const itemDetailHeader = (
        <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2 text-sm">
                <Link to="/inventory" className="text-gray-500 hover:text-gray-700">
                    Inventory
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">{item.name}</span>
            </div>

            <div className="flex items-center gap-2">
                {!isEditMode ? (
                    <>
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Edit className="w-4 h-4 text-gray-700" />
                            <span className="text-sm font-medium text-gray-700">Edit</span>
                        </button>
                        <button
                            onClick={() => setIsAttachmentModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Paperclip className="w-4 h-4 text-gray-700" />
                            <span className="text-sm font-medium text-gray-700">Add Attachment</span>
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-600">Delete</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setIsEditMode(false)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-sm font-medium text-gray-700">Cancel</span>
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <span className="text-sm font-medium">Save Changes</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <Layout header={itemDetailHeader}>
            <div className="flex flex-col h-full overflow-auto bg-white">
                <div className="p-6 space-y-6">
                    {!isEditMode ? (
                        <>
                            <div>
                                <h1 className="text-3xl font-semibold text-gray-900 mb-3">{item.name}</h1>
                                <div className="flex gap-2">
                                    {item.labels && item.labels.length > 0 ? (
                                        item.labels.map((label: any) => (
                                            <span
                                                key={label.id}
                                                className="px-3 py-1 rounded-md text-sm font-medium"
                                                style={{
                                                    backgroundColor: `${label.color}20`,
                                                    color: label.color
                                                }}
                                            >
                                                {label.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500">No labels</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center overflow-hidden">
                                        {currentImageId ? (
                                            <img
                                                src={getImageUrl(currentImageId)}
                                                alt={item.name}
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="w-24 h-24 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/></svg></div>';
                                                }}
                                            />
                                        ) : (
                                            <Package className="w-24 h-24 text-gray-300" />
                                        )}
                                    </div>

                                    <div className="flex gap-2 overflow-x-auto">
                                        {item.imageId && (
                                            <button
                                                onClick={() => setSelectedImageId(item.imageId!)}
                                                className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${(!selectedImageId || selectedImageId === item.imageId)
                                                    ? 'border-blue-500'
                                                    : 'border-gray-200'
                                                    }`}
                                            >
                                                <img
                                                    src={getImageUrl(item.imageId)}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        )}
                                        {item.attachments?.map((att: any) => (
                                            <button
                                                key={att.id}
                                                onClick={() => setSelectedImageId(att.id)}
                                                className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${selectedImageId === att.id
                                                    ? 'border-blue-500'
                                                    : 'border-gray-200'
                                                    }`}
                                            >
                                                <img
                                                    src={getImageUrl(att.id)}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setIsAttachmentModalOpen(true)}
                                            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 flex-shrink-0"
                                        >
                                            <Plus className="w-6 h-6 text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Key Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Location</p>
                                            <p className="text-sm text-gray-900 flex items-center gap-1">
                                                <MapPin className="w-4 h-4 text-blue-600" />
                                                {item.location?.name || 'N/A'}
                                            </p>
                                        </div>

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

                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Quantity</p>
                                            <p className="text-sm text-gray-900">{item.quantity}</p>
                                        </div>

                                        {item.purchaseTime && (
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Purchase Date</p>
                                                <p className="text-sm text-gray-900 flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {format(new Date(item.purchaseTime), 'MMMM d, yyyy')}
                                                </p>
                                            </div>
                                        )}

                                        {item.purchasePrice !== null && item.purchasePrice !== undefined && (
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Purchase Price</p>
                                                <p className="text-xl font-semibold text-gray-900">
                                                    ${item.purchasePrice.toFixed(2)}
                                                </p>
                                            </div>
                                        )}

                                        {item.warrantyExpires && (
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Warranty</p>
                                                <span className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                                    Active until {format(new Date(item.warrantyExpires), 'MMMM d, yyyy')}
                                                </span>
                                            </div>
                                        )}

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
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4 max-w-3xl">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <input
                                    type="text"
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        value={editFormData.quantity}
                                        onChange={(e) => setEditFormData({ ...editFormData, quantity: parseInt(e.target.value) || 1 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                                    <input
                                        type="number"
                                        value={editFormData.purchasePrice}
                                        onChange={(e) => setEditFormData({ ...editFormData, purchasePrice: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                <textarea
                                    value={editFormData.notes}
                                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                />
                            </div>
                        </div>
                    )}

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="flex border-b border-gray-200 bg-white">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Details
                            </button>
                            <button
                                onClick={() => setActiveTab('attachments')}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'attachments'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Attachments
                                {item.attachments && item.attachments.length > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                        {item.attachments.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'activity'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Activity
                            </button>
                        </div>

                        <div className="p-6 bg-white">
                            {activeTab === 'details' && (
                                <div className="grid grid-cols-2 gap-8">
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
                            )}

                            {activeTab === 'attachments' && (
                                <div>
                                    {item.attachments && item.attachments.length > 0 ? (
                                        <div className="grid grid-cols-4 gap-4">
                                            {item.attachments.map((att: any) => (
                                                <div
                                                    key={att.id}
                                                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                                                >
                                                    <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                                                        <img
                                                            src={getImageUrl(att.id)}
                                                            alt={att.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {att.title || 'Untitled'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Paperclip className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 mb-2">No attachments yet</p>
                                            <button
                                                onClick={() => setIsAttachmentModalOpen(true)}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Add your first attachment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'activity' && (
                                <div className="text-center py-12">
                                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No activity recorded</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Item</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Are you sure you want to delete "{item.name}"? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isAttachmentModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Add Attachment</h3>
                                <button
                                    onClick={() => setIsAttachmentModalOpen(false)}
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
                                        onChange={handleFileUpload}
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
                )}
            </div>
        </Layout>
    );
}