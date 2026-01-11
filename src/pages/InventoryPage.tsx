import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Layout } from '../components/Layout';
import { TableSkeleton } from '../components/LoadingSpinner';
import { InventoryHeader } from '../components/inventory/InventoryHeader';
import { InventoryFilters } from '../components/inventory/InventoryFilters';
import { InventoryTable } from '../components/inventory/InventoryTable';
import { AddItemModal } from '../components/inventory/AddItemModal';
import { Pagination } from '../components/inventory/Pagination';

interface Item {
    id: string;
    name: string;
    description: string;
    quantity: number;
    location?: { id: string; name: string };
    labels: Array<{ id: string; name: string; color: string }>;
    thumbnailId?: string;
    updatedAt: string;
}

/**
 * InventoryPage Component
 * Main page for managing inventory items
 */
export default function InventoryPage() {
    const queryClient = useQueryClient();
    const { attachmentToken } = useAuthStore();

    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: 1,
        purchasePrice: 0,
        notes: '',
        locationId: '',
        labelIds: [] as string[]
    });
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

    // Fetch items
    const { data: itemsData, isLoading, error } = useQuery({
        queryKey: ['items', searchQuery, page],
        queryFn: () => {
            const params: Record<string, any> = { page, pageSize: 8 };
            if (searchQuery.trim()) params.q = searchQuery.trim();
            return api.getItems(params);
        },
    });

    // Fetch locations for dropdown
    const { data: locationsData } = useQuery({
        queryKey: ['locations-tree'],
        queryFn: () => api.getLocationsTree(false),
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });

    // Create item mutation
    const createItemMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const item = await api.createItem(data);
            if (attachmentFile && item.id) {
                await api.uploadAttachment(item.id, attachmentFile);
            }
            return item;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
            setIsAddModalOpen(false);
            resetForm();
        },
        onError: () => {
            alert('Failed to create item. Please try again.');
        },
    });

    // Delete item mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.deleteItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
        onError: () => {
            alert('Failed to delete item. Please try again.');
        },
    });

    /**
     * Resets the form to initial state
     */
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            quantity: 1,
            purchasePrice: 0,
            notes: '',
            locationId: '',
            labelIds: []
        });
        setAttachmentFile(null);
        setUploading(false);
    };

    /**
     * Handles select all checkbox
     */
    const handleSelectAll = () => {
        if (!itemsData?.items) return;

        if (selectedItems.length === itemsData.items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(itemsData.items.map((item: Item) => item.id));
        }
    };

    /**
     * Handles adding a new item
     */
    const handleAddItem = () => {
        if (!formData.name.trim()) {
            alert('Please enter an item name');
            return;
        }
        setUploading(true);
        createItemMutation.mutate(formData);
    };

    /**
     * Handles file selection for attachment
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAttachmentFile(file);
        }
    };

    /**
     * Flattens location tree for dropdown
     */
    const flattenLocations = (nodes: any[]): any[] => {
        if (!Array.isArray(nodes)) return [];

        let result: any[] = [];
        nodes.forEach(node => {
            result.push(node);
            if (node.children && Array.isArray(node.children)) {
                result = result.concat(flattenLocations(node.children));
            }
        });
        return result;
    };

    const allLocations = locationsData && Array.isArray(locationsData)
        ? flattenLocations(locationsData)
        : [];

    const totalPages = itemsData ? Math.ceil(itemsData.total / 8) : 1;

    // Inventory header component
    const inventoryHeader = (
        <InventoryHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddItem={() => setIsAddModalOpen(true)}
            itemCount={itemsData?.total || 0}
        />
    );

    // Handle error state
    if (error) {
        return (
            <Layout header={inventoryHeader}>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Failed to load items</p>
                        <button
                            onClick={() => queryClient.invalidateQueries({ queryKey: ['items'] })}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout header={inventoryHeader}>
            <div className="flex flex-col h-full bg-gray-50">
                <InventoryFilters itemCount={itemsData?.total || 0} />

                <div className="flex-1 overflow-auto px-6 py-4">
                    {isLoading ? (
                        <TableSkeleton />
                    ) : (
                        <InventoryTable
                            items={itemsData?.items || []}
                            selectedItems={selectedItems}
                            onSelectAll={handleSelectAll}
                            onDelete={(id) => deleteMutation.mutate(id)}
                            attachmentToken={attachmentToken}
                        />
                    )}
                </div>

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={itemsData?.total || 0}
                    pageSize={8}
                    onPageChange={setPage}
                />
            </div>

            <AddItemModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                }}
                formData={formData}
                onFormChange={setFormData}
                onSubmit={handleAddItem}
                onFileChange={handleFileChange}
                uploading={uploading}
                locations={allLocations}
                attachmentFile={attachmentFile}
            />
        </Layout>
    );
}
