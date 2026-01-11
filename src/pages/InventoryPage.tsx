import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Added Eye icon to imports
import { Search, Download, Plus, Filter, ChevronRight, Trash2, Eye, X } from 'lucide-react';
import { api, API_BASE_URL } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Layout } from '../components/Layout';
import { TableSkeleton } from '../components/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

export default function InventoryPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { attachmentToken } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedFilters, setSelectedFilters] = useState<{
        locations: string[];
        labels: string[];
    }>({ locations: [], labels: [] });
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const { data: itemsData, isLoading, error } = useQuery({
        queryKey: ['items', searchQuery, page, selectedFilters],
        queryFn: () => {
            const params: any = { page, pageSize: 8 };
            if (searchQuery.trim()) params.q = searchQuery.trim();
            if (selectedFilters.locations.length > 0) params.locations = selectedFilters.locations;
            if (selectedFilters.labels.length > 0) params.labels = selectedFilters.labels;
            return api.getItems(params);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.deleteItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        },
    });

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent navigating to details
        if (window.confirm('Delete this item?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleSelectAll = () => {
        if (selectedItems.length === itemsData?.items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(itemsData?.items.map((item) => item.id) || []);
        }
    };

    const totalPages = itemsData ? Math.ceil(itemsData.total / 8) : 1;

    return (
        <Layout>
            <div className="flex flex-col h-full">
                {/* Header Section */}
                <div className="bg-white border-b border-slate-200 px-8 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
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
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm">
                                <Plus className="w-4 h-4" />
                                <span className="font-medium">Add Item</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="flex-1 overflow-auto px-8 py-6 bg-slate-50">
                    {isLoading ? <TableSkeleton /> : error ? (
                        <div className="bg-white border border-red-200 rounded-lg p-8 text-center text-red-600">Failed to load items.</div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto">
                            <div className="min-w-[1000px]">
                                {/* Table Header */}
                                <div className="bg-slate-50 border-b border-slate-200 flex items-center">
                                    <div className="w-16 px-6 py-4">
                                        <input type="checkbox" checked={selectedItems.length === itemsData?.items.length && itemsData?.items.length > 0} onChange={handleSelectAll} className="w-4 h-4 text-primary-500 rounded" />
                                    </div>
                                    <div className="flex-1 px-6 py-4 text-xs font-semibold text-slate-700 uppercase">Item</div>
                                    <div className="w-48 px-6 py-4 text-xs font-semibold text-slate-700 uppercase">Location</div>
                                    <div className="w-64 px-6 py-4 text-xs font-semibold text-slate-700 uppercase">Labels</div>
                                    <div className="w-28 px-6 py-4 text-xs font-semibold text-slate-700 uppercase">Qty</div>
                                    <div className="w-32 px-6 py-4 text-xs font-semibold text-slate-700 uppercase">Updated</div>
                                    <div className="w-32 px-6 py-4 text-xs font-semibold text-slate-700 uppercase text-right">Actions</div>
                                </div>

                                {/* Table Body */}
                                {itemsData?.items.map((item) => (
                                    <div
                                        key={item.id}
                                        // Corrected route to match App.tsx (/items/:id)
                                        onClick={() => navigate(`/items/${item.id}`)}
                                        className="flex items-center border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        <div className="w-16 px-6" onClick={(e) => e.stopPropagation()}>
                                            <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => { }} className="w-4 h-4 text-primary-500 rounded" />
                                        </div>
                                        <div className="flex-1 px-6 py-6 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0">
                                                {item.thumbnailId ? (
                                                    <img src={`${API_BASE_URL}/v1/items/${item.id}/attachments/${item.thumbnailId}?token=${attachmentToken}`} className="w-full h-full object-cover" alt="" />
                                                ) : <div className="w-full h-full bg-purple-200" />}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-medium text-slate-900 truncate">{item.name}</h3>
                                                <p className="text-sm text-slate-500 truncate">{item.description}</p>
                                            </div>
                                        </div>
                                        <div className="w-48 px-6 text-sm text-slate-600 truncate">{item.location?.name || 'No location'}</div>
                                        <div className="w-64 px-6 flex flex-wrap gap-2">
                                            {item.labels.slice(0, 2).map((label) => (
                                                <span key={label.id} className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: `${label.color}20`, color: label.color }}>{label.name}</span>
                                            ))}
                                        </div>
                                        <div className="w-28 px-6 font-medium text-slate-900">{item.quantity}</div>
                                        <div className="w-32 px-6 text-sm text-slate-600">{formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}</div>

                                        {/* Updated Actions Column with Details and Delete icons */}
                                        <div className="w-32 px-6 flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={() => navigate(`/items/${item.id}`)}
                                                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, item.id)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {itemsData && itemsData.total > 0 && (
                    <div className="bg-white border-t border-slate-200 px-8 py-4 flex justify-between items-center">
                        <p className="text-sm text-slate-600">Showing {((page - 1) * 8) + 1} to {Math.min(page * 8, itemsData.total)} of {itemsData.total} items</p>
                        <div className="flex gap-2">
                            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 border rounded-lg disabled:opacity-50"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                            <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-2 border rounded-lg disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}