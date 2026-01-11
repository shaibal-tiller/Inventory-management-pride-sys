import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Activity } from 'lucide-react';
import { api, API_BASE_URL } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
    ItemDetailHeader,
    ItemImageGallery,
    ItemKeyDetails,
    ItemEditForm,
    ItemTabs,
    ItemDetailsTab,
    ItemAttachmentsTab,
    DeleteConfirmModal,
    AttachmentUploadModal
} from '../components/items';

/**
 * ItemDetailPage Component
 * Displays detailed information about a single inventory item
 */
export default function ItemDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { attachmentToken } = useAuthStore();

    // State management
    const [activeTab, setActiveTab] = useState<'details' | 'attachments' | 'activity'>('details');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
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

    // Fetch item data
    const { data: item, isLoading, error } = useQuery({
        queryKey: ['item', id],
        queryFn: () => (id ? api.getItem(id) : null),
        enabled: !!id,
    });

    // Mutations
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

    /**
     * Handles file upload from attachment modal
     */
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploading(true);
            uploadMutation.mutate(file);
        }
    };

    /**
     * Enters edit mode and populates form with current item data
     */
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

    /**
     * Saves edited item data
     */
    const handleSaveEdit = () => {
        updateMutation.mutate(editFormData);
    };

    /**
     * Deletes the current item
     */
    const handleDelete = () => {
        deleteMutation.mutate();
    };

    /**
     * Generates image URL for attachments
     */
    const getImageUrl = (attachmentId: string) =>
        `${API_BASE_URL}/v1/items/${item!.id}/attachments/${attachmentId}?token=${attachmentToken}`;

    // Handle loading state
    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <LoadingSpinner />
                </div>
            </Layout>
        );
    }

    // Handle error state
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

    const itemDetailHeader = (
        <ItemDetailHeader
            itemName={item.name}
            isEditMode={isEditMode}
            onEdit={handleEdit}
            onDelete={() => setIsDeleteModalOpen(true)}
            onAddAttachment={() => setIsAttachmentModalOpen(true)}
            onCancelEdit={() => setIsEditMode(false)}
            onSaveEdit={handleSaveEdit}
        />
    );

    return (
        <Layout header={itemDetailHeader}>
            <div className="flex flex-col h-full overflow-auto bg-white">
                <div className="p-6 space-y-6">
                    {!isEditMode ? (
                        <>
                            {/* Item Title and Labels */}
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

                            {/* Image Gallery and Key Details Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                <ItemImageGallery
                                    itemId={item.id}
                                    itemName={item.name}
                                    imageId={item.imageId}
                                    attachments={item.attachments || []}
                                    selectedImageId={selectedImageId}
                                    onSelectImage={setSelectedImageId}
                                    onAddAttachment={() => setIsAttachmentModalOpen(true)}
                                    getImageUrl={getImageUrl}
                                />
                                <ItemKeyDetails item={item} />
                            </div>
                        </>
                    ) : (
                        <ItemEditForm
                            formData={editFormData}
                            onFormChange={setEditFormData}
                        />
                    )}

                    {/* Tabs for Details, Attachments, Activity */}
                    <ItemTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        attachmentCount={item.attachments?.length || 0}
                    >
                        {activeTab === 'details' && <ItemDetailsTab item={item} />}
                        {activeTab === 'attachments' && (
                            <ItemAttachmentsTab
                                attachments={item.attachments || []}
                                getImageUrl={getImageUrl}
                                onAddAttachment={() => setIsAttachmentModalOpen(true)}
                            />
                        )}
                        {activeTab === 'activity' && (
                            <div className="text-center py-12">
                                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No activity recorded</p>
                            </div>
                        )}
                    </ItemTabs>
                </div>

                {/* Modals */}
                <DeleteConfirmModal
                    isOpen={isDeleteModalOpen}
                    itemName={item.name}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDelete}
                />

                <AttachmentUploadModal
                    isOpen={isAttachmentModalOpen}
                    uploading={uploading}
                    onClose={() => setIsAttachmentModalOpen(false)}
                    onFileSelect={handleFileUpload}
                />
            </div>
        </Layout>
    );
}