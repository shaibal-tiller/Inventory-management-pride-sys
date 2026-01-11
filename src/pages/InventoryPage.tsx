import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Download, Plus, Filter, ChevronRight, Trash2, Eye, X, MoreVertical, Edit, Upload } from 'lucide-react';
import { api, API_BASE_URL } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Layout } from '../components/Layout';
import { TableSkeleton } from '../components/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

interface Location {
    id: string;
    name: string;
}

interface Label {
    id: string;
    name: string;
    color: string;
}

interface Item {
    id: string;
    name: string;
    description: string;
    quantity: number;
    location?: Location;
    labels: Label[];
    thumbnailId?: string;
    updatedAt: string;
}

export default function InventoryPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { attachmentToken } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
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

    const { data: itemsData, isLoading, error } = useQuery({
        queryKey: ['items', searchQuery, page],
        queryFn: () => {
            const params: Record<string, any> = { page, pageSize: 8 };
            if (searchQuery.trim()) params.q = searchQuery.trim();

            return api.getItems(params);
        },
    });

    const { data: locationsData } = useQuery({
        queryKey: ['locations-tree'],
        queryFn: () => api.getLocationsTree(false),
        retry: 1,
        staleTime: 5 * 60 * 1000,
    });



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

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.deleteItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
            setOpenMenuId(null);
        },
        onError: () => {
            alert('Failed to delete item. Please try again.');
        },
    });

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

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Delete this item?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleSelectAll = () => {
        if (!itemsData?.items) return;

        if (selectedItems.length === itemsData.items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(itemsData.items.map((item: Item) => item.id));
        }
    };

    const handleAddItem = () => {
        if (!formData.name.trim()) {
            alert('Please enter an item name');
            return;
        }
        setUploading(true);
        createItemMutation.mutate(formData);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAttachmentFile(file);
        }
    };

    const getFullLocationPath = (location?: Location): string => {
        if (!location) return 'N/A';
        return location.name || 'N/A';
    };

    const totalPages = itemsData ? Math.ceil(itemsData.total / 8) : 1;

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

    const inventoryHeader = (
        <div className="px-6 py-5">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 max-w-3xl">
                    <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Item
                    </button>
                </div>
            </div>
        </div>
    );

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
                <div className="px-6 py-3 bg-white border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Filters:</span>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md">
                            All Locations
                            <X className="w-3 h-3" />
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-md">
                            In Stock
                            <X className="w-3 h-3" />
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                            <Plus className="w-3 h-3" />
                            Add Filter
                        </button>
                        <div className="ml-auto flex items-center gap-4">
                            <span className="text-sm text-gray-600">{itemsData?.total || 0} items</span>
                            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                                <Filter className="w-4 h-4" />
                                Sort: Updated
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto px-6 py-4">
                    {isLoading ? (
                        <TableSkeleton />
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="w-12 px-6 py-3">
                                            <input
                                                type="checkbox"
                                                checked={itemsData?.items ? selectedItems.length === itemsData.items.length && itemsData.items.length > 0 : false}
                                                onChange={handleSelectAll}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Labels</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {itemsData?.items && itemsData.items.length > 0 ? (
                                        itemsData.items.map((item: Item) => (
                                            <tr
                                                key={item.id}
                                                onClick={() => navigate(`/items/${item.id}`)}
                                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                                            >
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedItems.includes(item.id)}
                                                        onChange={() => { }}
                                                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                            {item.thumbnailId ? (
                                                                <img
                                                                    src={`${API_BASE_URL}/v1/items/${item.id}/attachments/${item.thumbnailId}?token=${attachmentToken}`}
                                                                    className="w-full h-full object-cover"
                                                                    alt=""
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-purple-200 flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-medium text-gray-900 truncate">
                                                                {item.name || 'N/A'}
                                                            </div>
                                                            <div className="text-xs text-gray-500 truncate">
                                                                Model: {item.description || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {getFullLocationPath(item.location)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {item.labels && item.labels.length > 0 ? (
                                                            item.labels.slice(0, 3).map((label: Label) => (
                                                                <span
                                                                    key={label.id}
                                                                    className="px-2 py-0.5 text-xs font-medium rounded"
                                                                    style={{
                                                                        backgroundColor: `${label.color}20`,
                                                                        color: label.color
                                                                    }}
                                                                >
                                                                    {label.name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-gray-500">N/A</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{item.quantity}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {item.updatedAt ? formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true }) : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                                                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                        {openMenuId === item.id && (
                                                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigate(`/items/${item.id}`);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                    View Details
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigate(`/items/${item.id}`);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={(e) => handleDelete(e, item.id)}
                                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Remove Item
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                                No items found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {itemsData && itemsData.total > 0 && (
                    <div className="bg-white border-t border-gray-200 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{((page - 1) * 8) + 1}</span> to <span className="font-medium">{Math.min(page * 8, itemsData.total)}</span> of{' '}
                                <span className="font-medium">{itemsData.total}</span> items
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    <ChevronRight className="w-4 h-4 rotate-180" />
                                </button>
                                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg ${page === pageNum
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                {totalPages > 5 && (
                                    <>
                                        <span className="px-2 text-gray-500">...</span>
                                        <button
                                            onClick={() => setPage(totalPages)}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg ${page === totalPages
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                    className="px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={() => setIsAddModalOpen(false)}>
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Item</h3>
                            <button
                                onClick={() => {
                                    setIsAddModalOpen(false);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    placeholder="Enter item name..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    placeholder="Enter description..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                                    <input
                                        type="number"
                                        value={formData.purchasePrice}
                                        onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <select
                                    value={formData.locationId}
                                    onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                >
                                    <option value="">Select a location</option>
                                    {allLocations.map((location: any) => (
                                        <option key={location.id} value={location.id}>
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24"
                                    placeholder="Add any additional notes..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <input
                                        type="file"
                                        id="add-file-upload"
                                        className="hidden"
                                        onChange={handleFileChange}
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

                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={() => {
                                    setIsAddModalOpen(false);
                                    resetForm();
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddItem}
                                disabled={!formData.name || uploading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? 'Adding...' : 'Add Item'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}