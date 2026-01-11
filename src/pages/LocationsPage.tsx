import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    Search, Plus, ChevronRight, MapPin, Box, Trash2, X, Package, ArrowRight, Pencil
} from 'lucide-react';
import { api, API_BASE_URL } from '../lib/api';
import type { TreeItem } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { format } from 'date-fns';

export default function LocationsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { attachmentToken } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    const [modal, setModal] = useState<{ type: 'create' | 'edit' | 'add-item' | 'delete' | null, parentId?: string | null }>({ type: null });
    const [formData, setFormData] = useState({ name: '', description: '', quantity: 1, purchasePrice: 0 });

    const { data: locationTree, isLoading: treeLoading, error: treeError } = useQuery({
        queryKey: ['locations-tree'],
        queryFn: () => api.getLocationsTree(false),
    });

    const { data: selectedLocation } = useQuery({
        queryKey: ['location', selectedLocationId],
        queryFn: () => (selectedLocationId ? api.getLocation(selectedLocationId) : null),
        enabled: !!selectedLocationId,
    });

    const { data: itemsInLocation } = useQuery({
        queryKey: ['items', 'location', selectedLocationId],
        queryFn: () => api.getItems({ locations: [selectedLocationId!] }),
        enabled: !!selectedLocationId,
    });

    const filteredTree = useMemo(() => {
        if (!searchQuery.trim() || !locationTree) return locationTree;

        const filterNodes = (nodes: TreeItem[]): TreeItem[] => {
            return nodes.reduce((acc: TreeItem[], node) => {
                const matches = node.name.toLowerCase().includes(searchQuery.toLowerCase());
                const filteredChildren = node.children ? filterNodes(node.children) : [];

                if (matches || filteredChildren.length > 0) {
                    acc.push({
                        ...node,
                        children: filteredChildren
                    });
                }
                return acc;
            }, []);
        };

        return filterNodes(locationTree);
    }, [locationTree, searchQuery]);

    const locationMutation = useMutation({
        mutationFn: (data: any) => modal.type === 'edit'
            ? api.updateLocation(selectedLocationId!, data)
            : api.createLocation({ ...data, parentId: modal.parentId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations-tree'] });
            queryClient.invalidateQueries({ queryKey: ['location'] });
            setModal({ type: null });
            setFormData({ name: '', description: '', quantity: 1, purchasePrice: 0 });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => api.deleteLocation(selectedLocationId!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations-tree'] });
            setSelectedLocationId(null);
            setModal({ type: null });
        }
    });

    const addItemMutation = useMutation({
        mutationFn: (data: any) => api.createItem({ ...data, locationId: selectedLocationId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items', 'location', selectedLocationId] });
            setModal({ type: null });
            setFormData({ name: '', description: '', quantity: 1, purchasePrice: 0 });
        }
    });

    const openModal = (type: any, parentId: string | null = null) => {
        if (type === 'edit' && selectedLocation) {
            setFormData({ name: selectedLocation.name, description: selectedLocation.description || '', quantity: 1, purchasePrice: 0 });
        } else {
            setFormData({ name: '', description: '', quantity: 1, purchasePrice: 0 });
        }
        setModal({ type, parentId });
    };

    const toggleNode = (id: string) => {
        setExpandedNodes((prev) => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    const getLocationIconColor = (node: TreeItem) => {
        // Use a simple hash to get consistent colors for locations
        const colors = [
            'text-blue-500',
            'text-green-500',
            'text-purple-500',
            'text-orange-500',
            'text-teal-500',
            'text-pink-500',
            'text-indigo-500',
            'text-amber-500'
        ];
        const hash = node.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const renderTreeNode = (node: TreeItem, level: number = 0) => {
        const isExpanded = expandedNodes.has(node.id);
        const isSelected = selectedLocationId === node.id;
        const hasChildren = node.children && node.children.length > 0;
        const iconColor = getLocationIconColor(node);

        return (
            <div key={node.id}>
                <button
                    onClick={() => {
                        if (node.type === 'location') setSelectedLocationId(node.id);
                        if (hasChildren) toggleNode(node.id);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${isSelected
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                        }`}
                    style={{ paddingLeft: `${12 + level * 16}px` }}
                >
                    {hasChildren && (
                        <ChevronRight
                            className={`w-4 h-4 transition-transform text-gray-400 ${isExpanded ? 'rotate-90' : ''}`}
                        />
                    )}
                    {!hasChildren && <div className="w-4" />}
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-blue-600' : iconColor}`} />
                    <span className="truncate flex-1 text-left">{node.name}</span>
                    {node.type === 'location' && (
                        <span className="text-xs text-gray-500">{node.children?.length || 0}</span>
                    )}
                </button>
                {isExpanded && hasChildren && (
                    <div>{node.children?.map((child) => renderTreeNode(child, level + 1))}</div>
                )}
            </div>
        );
    };

    if (treeLoading) return <Layout><LoadingSpinner /></Layout>;

    if (treeError) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Failed to load locations</p>
                        <button
                            onClick={() => queryClient.invalidateQueries({ queryKey: ['locations-tree'] })}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const locationsHeader = (
        <div className="px-8 py-6 flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Locations</h1>
            <p className="text-sm text-gray-500">Organize your items by location</p>
        </div>
    );

    return (
        <Layout header={locationsHeader}>
            <div className="flex h-full bg-gray-50">
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                    <div className="py-4">
                        <div className="relative mb-3 px-4">
                            <input
                                type="text"
                                placeholder="Search locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            <Search className="mx-4 absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <div className="border-t border-gray-200 my-3 w-full"></div>
                        <button
                            onClick={() => openModal('create')}
                            className="mx-4 w-[calc(100%-32px)] py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Location
                        </button>
                    </div>
                    <div className="border-t border-gray-200"></div>

                    <div className="flex-1 overflow-auto p-2">
                        {filteredTree?.map((node: TreeItem) => renderTreeNode(node, 0))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-auto">
                        {selectedLocation ? (
                            <div className="p-8 max-w-5xl mx-auto">
                                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
                                                <MapPin className="w-7 h-7 text-teal-600" />
                                            </div>
                                            <div>
                                                <h1 className="text-2xl font-semibold text-gray-900 mb-1">{selectedLocation.name}</h1>
                                                {selectedLocation.parent && (
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        Home
                                                        <ChevronRight className="w-3 h-3" />
                                                        {selectedLocation.parent.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openModal('edit')}
                                                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md flex items-center gap-1.5 transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => openModal('create', selectedLocation.id)}
                                                className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-blue-300 hover:bg-blue-50 rounded-md flex items-center gap-1.5 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Child
                                            </button>
                                            <button
                                                onClick={() => setModal({ type: 'delete' })}
                                                className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 hover:bg-red-50 rounded-md flex items-center gap-1.5 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {selectedLocation.description && (
                                        <div className="mb-6">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</p>
                                            <p className="text-sm text-gray-700 leading-relaxed">{selectedLocation.description}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-3 gap-8 pt-6 border-t border-gray-100">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Items</p>
                                            <p className="text-2xl font-semibold text-gray-900">{itemsInLocation?.total || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Value</p>
                                            <p className="text-2xl font-semibold text-gray-900">
                                                ${selectedLocation.totalPrice?.toLocaleString() || '0'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Created</p>
                                            <p className="text-base text-gray-900">
                                                {format(new Date(selectedLocation.createdAt), 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                    <div className="px-6 py-4 flex items-center justify-between">
                                        <div className="flex items-center justify-between w-full">
                                            <h2 className="text-base font-semibold text-gray-900">Items in this Location</h2>
                                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                                View All
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        {itemsInLocation?.items.map((item: any) => (
                                            <div
                                                key={item.id}
                                                onClick={() => navigate(`/items/${item.id}`)}
                                                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer group border border-gray-200 rounded-lg transition-colors"
                                            >
                                                <div className="w-12 h-12 bg-purple-100 rounded-lg overflow-hidden shrink-0">
                                                    {item.thumbnailId ? (
                                                        <img
                                                            src={`${API_BASE_URL}/v1/items/${item.id}/attachments/${item.thumbnailId}?token=${attachmentToken}`}
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 to-purple-300">
                                                            <Package className="w-6 h-6 text-purple-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate mb-0.5">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {item.labels[0]?.name || 'General'} • Added {format(new Date(item.updatedAt), 'MMM d, yyyy')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-gray-900 mb-1">
                                                        ${item.purchasePrice?.toLocaleString() || '—'}
                                                    </p>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-medium">
                                                        Good
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {(!itemsInLocation?.items || itemsInLocation.items.length === 0) && (
                                            <div className="py-12 text-center">
                                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500 text-sm">No items in this location</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="border-t border-gray-200 px-4 py-3">
                                        <button
                                            onClick={() => openModal('add-item')}
                                            className="w-full px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 font-medium flex items-center justify-center gap-2 rounded-lg transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Item to this Location
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Box className="w-20 h-20 mb-4" />
                                <p className="text-lg font-medium">Select a location to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {modal.type && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {modal.type === 'delete' ? 'Delete Location' :
                                    modal.type === 'add-item' ? 'Add Item' :
                                        modal.type === 'edit' ? 'Edit Location' : 'New Location'}
                            </h2>
                            <button
                                onClick={() => setModal({ type: null })}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {modal.type === 'delete' ? (
                            <div>
                                <p className="text-sm text-gray-600 mb-6">
                                    Are you sure you want to delete "{selectedLocation?.name}"? This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setModal({ type: null })}
                                        className="flex-1 py-2.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => deleteMutation.mutate()}
                                        className="flex-1 py-2.5 bg-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-700 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                        <input
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                            placeholder="Enter name..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm h-24 resize-none"
                                            placeholder="Optional details..."
                                        />
                                    </div>
                                    {modal.type === 'add-item' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                                <input
                                                    type="number"
                                                    value={formData.quantity}
                                                    onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                                                <input
                                                    type="number"
                                                    step="1"
                                                    value={formData.purchasePrice}
                                                    onChange={e => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={() => modal.type === 'add-item' ? addItemMutation.mutate(formData) : locationMutation.mutate(formData)}
                                    className="w-full mt-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    {modal.type === 'edit' ? 'Update' : 'Create'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
}