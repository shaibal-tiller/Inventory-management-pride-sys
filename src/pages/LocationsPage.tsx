import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box } from 'lucide-react';
import { api } from '../lib/api';
import type { TreeItem } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
    LocationsSidebar,
    LocationDetails,
    LocationItemsList,
    LocationModal
} from '../components/locations';

/**
 * LocationsPage Component
 * Manages locations and their hierarchical structure
 */
export default function LocationsPage() {
    const queryClient = useQueryClient();
    const { attachmentToken } = useAuthStore();

    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const [modal, setModal] = useState<{
        type: 'create' | 'edit' | 'add-item' | 'delete' | null;
        parentId?: string | null;
    }>({ type: null });
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: 1,
        purchasePrice: 0
    });

    // Fetch location tree
    const { data: locationTree, isLoading: treeLoading, error: treeError } = useQuery({
        queryKey: ['locations-tree'],
        queryFn: () => api.getLocationsTree(false),
    });

    // Fetch selected location details
    const { data: selectedLocation } = useQuery({
        queryKey: ['location', selectedLocationId],
        queryFn: () => (selectedLocationId ? api.getLocation(selectedLocationId) : null),
        enabled: !!selectedLocationId,
    });

    // Fetch items in selected location
    const { data: itemsInLocation } = useQuery({
        queryKey: ['items', 'location', selectedLocationId],
        queryFn: () => api.getItems({ locations: [selectedLocationId!] }),
        enabled: !!selectedLocationId,
    });

    /**
     * Filter location tree based on search query
     */
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

    // Location mutations
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

    /**
     * Opens modal with appropriate data
     */
    const openModal = (type: any, parentId: string | null = null) => {
        if (type === 'edit' && selectedLocation) {
            setFormData({
                name: selectedLocation.name,
                description: selectedLocation.description || '',
                quantity: 1,
                purchasePrice: 0
            });
        } else {
            setFormData({ name: '', description: '', quantity: 1, purchasePrice: 0 });
        }
        setModal({ type, parentId });
    };

    /**
     * Handles modal submission
     */
    const handleModalSubmit = () => {
        if (modal.type === 'delete') {
            deleteMutation.mutate();
        } else if (modal.type === 'add-item') {
            addItemMutation.mutate(formData);
        } else {
            locationMutation.mutate(formData);
        }
    };

    /**
     * Toggles node expansion in tree
     */
    const toggleNode = (id: string) => {
        setExpandedNodes((prev) => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    // Handle loading state
    if (treeLoading) return <Layout><LoadingSpinner /></Layout>;

    // Handle error state
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
                {/* Sidebar with location tree */}
                <LocationsSidebar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onNewLocation={() => openModal('create')}
                    locationTree={filteredTree}
                    selectedLocationId={selectedLocationId}
                    expandedNodes={expandedNodes}
                    onSelectLocation={setSelectedLocationId}
                    onToggleNode={toggleNode}
                />

                {/* Main content area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-auto">
                        {selectedLocation ? (
                            <div className="p-8 max-w-5xl mx-auto">
                                {/* Location details */}
                                <LocationDetails
                                    location={selectedLocation}
                                    itemCount={itemsInLocation?.total || 0}
                                    onEdit={() => openModal('edit')}
                                    onAddChild={() => openModal('create', selectedLocation.id)}
                                    onDelete={() => setModal({ type: 'delete' })}
                                />

                                {/* Items in location */}
                                <LocationItemsList
                                    items={itemsInLocation?.items || []}
                                    onAddItem={() => openModal('add-item')}
                                    attachmentToken={attachmentToken}
                                />
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

            {/* Modals */}
            <LocationModal
                isOpen={!!modal.type}
                type={modal.type}
                onClose={() => setModal({ type: null })}
                onSubmit={handleModalSubmit}
                formData={formData}
                onFormChange={setFormData}
                locationName={selectedLocation?.name}
            />
        </Layout>
    );
}
