import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Search,
    Plus,
    ChevronRight,
    Home as HomeIcon,
    Archive,
    Box,
    Edit,
    Trash2,
    Bell,
    HelpCircle,
} from 'lucide-react';
import { api, TreeItem } from '../lib/api';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function LocationsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

    // Fetch location tree
    const { data: locationTree, isLoading: treeLoading } = useQuery({
        queryKey: ['locations-tree'],
        queryFn: () => api.getLocationsTree(true),
    });

    // Fetch selected location details
    const { data: selectedLocation } = useQuery({
        queryKey: ['location', selectedLocationId],
        queryFn: () => (selectedLocationId ? api.getLocation(selectedLocationId) : null),
        enabled: !!selectedLocationId,
    });

    const toggleNode = (id: string) => {
        setExpandedNodes((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const renderTreeNode = (node: TreeItem, level: number = 0) => {
        const isExpanded = expandedNodes.has(node.id);
        const isSelected = selectedLocationId === node.id;
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div key={node.id}>
                <button
                    onClick={() => {
                        if (node.type === 'location') {
                            setSelectedLocationId(node.id);
                        }
                        if (hasChildren) {
                            toggleNode(node.id);
                        }
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isSelected
                            ? 'bg-blue-50 text-primary-600'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                    style={{ paddingLeft: `${level * 20 + 12}px` }}
                >
                    {hasChildren && (
                        <ChevronRight
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''
                                }`}
                        />
                    )}
                    {node.type === 'location' ? (
                        level === 0 ? (
                            <HomeIcon className="w-4 h-4" />
                        ) : (
                            <Archive className="w-4 h-4" />
                        )
                    ) : (
                        <Box className="w-4 h-4" />
                    )}
                    <span className="font-medium flex-1 text-left">{node.name}</span>
                    {hasChildren && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {node.children?.length}
                        </span>
                    )}
                </button>

                {isExpanded && hasChildren && (
                    <div>
                        {node.children?.map((child) => renderTreeNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (treeLoading) {
        return (
            <Layout>
                <LoadingSpinner />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex h-full">
                {/* Left Sidebar - Location Tree */}
                <div className="w-96 bg-white border-r border-slate-200 flex flex-col">
                    {/* Header */}
                    <div className="px-4 py-4 border-b border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-900 mb-1">Locations</h2>
                        <p className="text-sm text-slate-500">
                            Organize your items by location
                        </p>
                    </div>

                    {/* Search */}
                    <div className="px-4 py-4 border-b border-slate-200">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
                            />
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    {/* New Location Button */}
                    <div className="px-4 py-4 border-b border-slate-200">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm">
                            <Plus className="w-4 h-4" />
                            <span className="font-medium">New Location</span>
                        </button>
                    </div>

                    {/* Tree */}
                    <div className="flex-1 overflow-auto p-4">
                        {locationTree?.map((node) => renderTreeNode(node))}
                    </div>
                </div>

                {/* Right Panel - Location Details */}
                <div className="flex-1 overflow-auto">
                    {selectedLocation ? (
                        <div className="p-6">
                            {/* Header */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center">
                                            <Archive className="w-7 h-7 text-teal-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                                <HomeIcon className="w-3.5 h-3.5" />
                                                <span>Home</span>
                                                <ChevronRight className="w-3 h-3" />
                                                <span>{selectedLocation.parent?.name || 'Living Room'}</span>
                                            </div>
                                            <h1 className="text-2xl font-semibold text-slate-900">
                                                {selectedLocation.name}
                                            </h1>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                            <Edit className="w-4 h-4" />
                                            <span className="font-medium text-slate-700">Edit</span>
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                            <Plus className="w-4 h-4" />
                                            <span className="font-medium text-slate-700">Add Child</span>
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                            <span className="font-medium">Delete</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Description */}
                                {selectedLocation.description && (
                                    <div className="mb-4">
                                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                            Description
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {selectedLocation.description}
                                        </p>
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                            Items
                                        </p>
                                        <p className="text-2xl font-semibold text-slate-900">2</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                            Total Value
                                        </p>
                                        <p className="text-2xl font-semibold text-slate-900">$245</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                            Created
                                        </p>
                                        <p className="text-sm font-medium text-slate-600">
                                            Jan 15, 2024
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Items in Location */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        Items in this Location
                                    </h2>
                                    <button className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
                                        View All
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {/* Mock Item 1 */}
                                    <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Box className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-slate-900">
                                                Vintage Camera Collection
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                Electronics • Added 2 weeks ago
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-900">$180</p>
                                            <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                                Good
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mock Item 2 */}
                                    <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Box className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-slate-900">
                                                Book Collection
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                Books • Added 1 month ago
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-900">$65</p>
                                            <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                                                Good
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Add Item Button */}
                                <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 rounded-lg text-primary-600 hover:bg-blue-50 hover:border-primary-300 transition-colors">
                                    <Plus className="w-5 h-5" />
                                    <span className="font-medium">Add Item to this Location</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">
                            <div className="text-center">
                                <Archive className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Select a location to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Top Right Icons */}
            <div className="fixed top-6 right-6 flex items-center gap-3">
                <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm">
                    <Bell className="w-5 h-5 text-slate-600" />
                </button>
                <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm">
                    <HelpCircle className="w-5 h-5 text-slate-600" />
                </button>
            </div>
        </Layout>
    );
}