import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Download, Plus, Filter, ChevronRight, MoreVertical, X } from 'lucide-react';
import { api } from '../lib/api';
import { Layout } from '../components/Layout';
import { TableSkeleton } from '../components/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

export default function InventoryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedFilters, setSelectedFilters] = useState<{
        locations: string[];
        labels: string[];
    }>({
        locations: [],
        labels: [],
    });
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    // Fetch items
    const { data: itemsData, isLoading, error } = useQuery({
        queryKey: ['items', searchQuery, page, selectedFilters],
        queryFn: () =>
            api.getItems({
                q: searchQuery || undefined,
                page,
                pageSize: 8,
                locations: selectedFilters.locations.length > 0 ? selectedFilters.locations : undefined,
                labels: selectedFilters.labels.length > 0 ? selectedFilters.labels : undefined,
            }),
    });

    // Fetch locations for filter
    const { data: locations } = useQuery({
        queryKey: ['locations'],
        queryFn: () => api.getLocations(),
    });

    // Fetch labels for filter
    const { data: labels } = useQuery({
        queryKey: ['labels'],
        queryFn: () => api.getLabels(),
    });

    const handleSelectAll = () => {
        if (selectedItems.length === itemsData?.items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(itemsData?.items.map((item) => item.id) || []);
        }
    };

    const handleSelectItem = (id: string) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const totalPages = itemsData ? Math.ceil(itemsData.total / 8) : 1;

    return (
        <Layout>
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>

                            {/* Search */}
                            <div className="relative max-w-md flex-1">
                                <input
                                    type="text"
                                    placeholder="Search items..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                <Download className="w-4 h-4" />
                                <span className="font-medium text-slate-700">Export</span>
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm">
                                <Plus className="w-4 h-4" />
                                <span className="font-medium">Add Item</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white border-b border-slate-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700">Filters:</span>

                            {/* Location Filter Example */}
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-primary-600 rounded-lg text-sm font-medium">
                                All Locations
                                <X className="w-3.5 h-3.5" />
                            </button>

                            {/* In Stock Filter Example */}
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-primary-600 rounded-lg text-sm font-medium">
                                In Stock
                                <X className="w-3.5 h-3.5" />
                            </button>

                            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                                <Plus className="w-3.5 h-3.5" />
                                Add Filter
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600">
                                {itemsData?.total || 0} items
                            </span>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Filter className="w-4 h-4" />
                                <span>Sort: Updated</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto px-8 py-6 bg-slate-50">
                    {isLoading ? (
                        <TableSkeleton />
                    ) : error ? (
                        <div className="bg-white border border-red-200 rounded-lg p-8 text-center">
                            <p className="text-red-600">Failed to load items. Please try again.</p>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            {/* Table Header */}
                            <div className="bg-slate-50 border-b border-slate-200">
                                <div className="flex items-center">
                                    <div className="w-16 px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.length === itemsData?.items.length && itemsData?.items.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-primary-500 border-gray-500 rounded"
                                        />
                                    </div>
                                    <div className="flex-1 px-6 py-4">
                                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Item
                                        </span>
                                    </div>
                                    <div className="w-48 px-6 py-4">
                                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Location
                                        </span>
                                    </div>
                                    <div className="w-64 px-6 py-4">
                                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Labels
                                        </span>
                                    </div>
                                    <div className="w-28 px-6 py-4">
                                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Quantity
                                        </span>
                                    </div>
                                    <div className="w-32 px-6 py-4">
                                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Updated
                                        </span>
                                    </div>
                                    <div className="w-20 px-6 py-4">
                                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                                            Actions
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div>
                                {itemsData?.items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`flex items-center border-b border-slate-200 hover:bg-slate-50 transition-colors ${index === itemsData.items.length - 1 ? 'border-b-0' : ''
                                            }`}
                                    >
                                        {/* Checkbox */}
                                        <div className="w-16 px-6">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleSelectItem(item.id)}
                                                className="w-4 h-4 text-primary-500 border-gray-500 rounded"
                                            />
                                        </div>

                                        {/* Item */}
                                        <div className="flex-1 px-6 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                                                    {item.thumbnailId ? (
                                                        <img
                                                            src={`${api}/v1/items/${item.id}/attachments/${item.thumbnailId}`}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 bg-purple-200 rounded" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-slate-900 leading-tight">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 leading-tight mt-0.5">
                                                        {item.description || 'No description'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="w-48 px-6">
                                            {item.location ? (
                                                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                    <span>Garage</span>
                                                    <ChevronRight className="w-3 h-3 text-slate-400" />
                                                    <span>{item.location.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400">No location</span>
                                            )}
                                        </div>

                                        {/* Labels */}
                                        <div className="w-64 px-6">
                                            <div className="flex items-center gap-2">
                                                {item.labels.slice(0, 2).map((label) => (
                                                    <span
                                                        key={label.id}
                                                        className="px-2.5 py-1 rounded-md text-xs font-medium"
                                                        style={{
                                                            backgroundColor: getLabelBgColor(label.name),
                                                            color: getLabelTextColor(label.name),
                                                        }}
                                                    >
                                                        {label.name}
                                                    </span>
                                                ))}
                                                {item.labels.length > 2 && (
                                                    <span className="text-xs text-slate-500">
                                                        +{item.labels.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="w-28 px-6">
                                            <span className="font-medium text-slate-900">{item.quantity}</span>
                                        </div>

                                        {/* Updated */}
                                        <div className="w-32 px-6">
                                            <span className="text-sm text-slate-600">
                                                {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}
                                            </span>
                                        </div>

                                        {/* Actions */}
                                        <div className="w-20 px-6">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                <MoreVertical className="w-4 h-4 text-slate-400" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {itemsData?.items.length === 0 && (
                                    <div className="py-12 text-center text-slate-500">
                                        <p>No items found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {itemsData && itemsData.total > 0 && (
                    <div className="bg-white border-t border-slate-200 px-8 py-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-600">
                                Showing {((page - 1) * 8) + 1}-{Math.min(page * 8, itemsData.total)} of{' '}
                                {itemsData.total} items
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-5 h-5 rotate-180" />
                                </button>

                                {/* Page Numbers */}
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === pageNum
                                                ? 'bg-primary-500 text-white'
                                                : 'border border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                {totalPages > 5 && <span className="px-2 text-slate-400">...</span>}

                                {totalPages > 5 && (
                                    <button
                                        onClick={() => setPage(totalPages)}
                                        className={`px-4 py-2 rounded-lg font-medium border border-slate-300 hover:bg-slate-50`}
                                    >
                                        {totalPages}
                                    </button>
                                )}

                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

// Helper functions for label colors
function getLabelBgColor(name: string): string {
    const colors: Record<string, string> = {
        'Power Tools': '#DBEAFE',
        Warranty: '#DCFCE7',
        Electronics: '#F3E8FF',
        Appliances: '#FFEDD5',
        Outdoor: '#CCFBF1',
        Seasonal: '#FEF9C3',
        Premium: '#FFEDD5',
        Audio: '#F3E8FF',
        'High Value': '#FEE2E2',
    };
    return colors[name] || '#F1F5F9';
}

function getLabelTextColor(name: string): string {
    const colors: Record<string, string> = {
        'Power Tools': '#1D4ED8',
        Warranty: '#15803D',
        Electronics: '#7E22CE',
        Appliances: '#C2410C',
        Outdoor: '#0F766E',
        Seasonal: '#A16207',
        Premium: '#C2410C',
        Audio: '#7E22CE',
        'High Value': '#B91C1C',
    };
    return colors[name] || '#475569';
}