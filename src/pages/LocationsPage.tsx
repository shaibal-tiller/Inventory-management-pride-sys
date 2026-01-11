import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    Search, Plus, ChevronRight, Home as HomeIcon,
    Archive, Box, Edit, Trash2, X, Package, Check, Save
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
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));

    // Modal States
    const [modal, setModal] = useState<{ type: 'create' | 'edit' | 'add-item' | 'delete' | null, parentId?: string | null }>({ type: null });
    const [formData, setFormData] = useState({ name: '', description: '', quantity: 1 });

    // 1. Data Fetching
    const { data: locationTree, isLoading: treeLoading } = useQuery({
        queryKey: ['locations-tree'],
        queryFn: () => api.getLocationsTree(true),
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

    // 2. Tree Filtering Logic
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

    // 3. Mutations
    const locationMutation = useMutation({
        mutationFn: (data: any) => modal.type === 'edit'
            ? api.updateLocation(selectedLocationId!, data)
            : api.createLocation({ ...data, parentId: modal.parentId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations-tree'] });
            queryClient.invalidateQueries({ queryKey: ['location'] });
            setModal({ type: null });
            setFormData({ name: '', description: '', quantity: 1 });
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
            setFormData({ name: '', description: '', quantity: 1 });
        }
    });

    // 4. Handlers
    const openModal = (type: any, parentId: string | null = null) => {
        if (type === 'edit' && selectedLocation) {
            setFormData({ name: selectedLocation.name, description: selectedLocation.description || '', quantity: 1 });
        } else {
            setFormData({ name: '', description: '', quantity: 1 });
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

    const renderTreeNode = (node: TreeItem, level: number = 0) => {
        const isExpanded = expandedNodes.has(node.id);
        const isSelected = selectedLocationId === node.id;
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div key={node.id}>
                <button
                    onClick={() => {
                        if (node.type === 'location') setSelectedLocationId(node.id);
                        if (hasChildren) toggleNode(node.id);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${isSelected ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                    style={{ marginLeft: `${level * 16}px`, width: `calc(100% - ${level * 16}px)` }}
                >
                    {hasChildren && <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />}
                    <Archive className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-primary-500'}`} />
                    <span className="text-sm font-bold truncate flex-1 text-left">{node.name}</span>
                </button>
                {isExpanded && hasChildren && <div>{node.children?.map((child) => renderTreeNode(child, level + 1))}</div>}
            </div>
        );
    };

    if (treeLoading) return <Layout><LoadingSpinner /></Layout>;

    return (
        <Layout>
            <div className="flex h-full bg-[#F8FAFC]">
                {/* SIDEBAR: SEARCH & TREE */}
                <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
                    <div className="p-8 border-b border-slate-100">
                        <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tighter">Locations</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Storage Hierarchy</p>
                    </div>

                    {/* RESTORED SEARCH AT TOP OF BUTTON */}
                    <div className="p-6 space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/10 outline-none text-sm font-bold"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                        <button onClick={() => openModal('create')} className="w-full py-4 bg-primary-500 text-white rounded-2xl font-black text-sm hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2">
                            <Plus className="w-5 h-5" /> NEW LOCATION
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto px-4 pb-10 space-y-1">
                        {filteredTree?.map((node: TreeItem) => renderTreeNode(node))}
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 overflow-auto p-12">
                    {selectedLocation ? (
                        <div className="max-w-5xl mx-auto space-y-10">
                            {/* LOCATION HEADER */}
                            <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
                                <div className="flex items-start justify-between relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center text-primary-600 shadow-inner">
                                            <Archive className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-primary-500 uppercase tracking-[0.2em] mb-2">
                                                {selectedLocation.parent?.name || 'ROOT DIRECTORY'}
                                            </p>
                                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{selectedLocation.name}</h1>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => openModal('edit')} className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all border border-slate-200"><Edit className="w-5 h-5" /></button>
                                        <button onClick={() => openModal('create', selectedLocation.id)} className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all border border-slate-200"><Plus className="w-5 h-5" /></button>
                                        <button onClick={() => setModal({ type: 'delete' })} className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all border border-red-100"><Trash2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-10 mt-12 pt-10 border-t border-slate-50">
                                    <StatBox label="Stored Assets" value={itemsInLocation?.total || 0} />
                                    <StatBox label="Estimated Value" value={`$${selectedLocation.totalPrice?.toLocaleString() || '0'}`} />
                                    <StatBox label="Date Created" value={format(new Date(selectedLocation.createdAt), 'MMM yyyy')} />
                                </div>
                            </div>

                            {/* ITEM LIST IN LOCATION */}
                            <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm">
                                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Items in this Zone</h2>
                                    <button onClick={() => openModal('add-item')} className="px-6 py-3 bg-[#0F172A] text-white rounded-xl font-black text-xs tracking-widest hover:bg-primary-600 transition-all">+ ADD ITEM</button>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {itemsInLocation?.items.map((item: any) => (
                                        <div key={item.id} onClick={() => navigate(`/items/${item.id}`)} className="flex items-center gap-6 p-8 hover:bg-slate-50 transition-all cursor-pointer group">
                                            <div className="w-16 h-16 bg-white rounded-[20px] overflow-hidden border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                                                {item.thumbnailId ? (
                                                    <img src={`${API_BASE_URL}/v1/items/${item.id}/attachments/${item.thumbnailId}?token=${attachmentToken}`} className="w-full h-full object-cover" alt="" />
                                                ) : <Package className="w-full h-full p-5 text-slate-200" />}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{item.name}</h3>
                                                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{item.labels[0]?.name || 'GENERAL'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-slate-900">${item.purchasePrice?.toLocaleString() || '—'}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase">QTY: {item.quantity}</p>
                                            </div>
                                            <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    ))}
                                    {itemsInLocation?.items.length === 0 && <div className="py-32 text-center text-slate-300 font-black uppercase tracking-[0.3em]">No Assets Found</div>}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-200">
                            <Archive className="w-32 h-32 mb-8 opacity-5" />
                            <p className="text-2xl font-black uppercase tracking-[0.4em] opacity-20">Select Storage Zone</p>
                        </div>
                    )}
                </div>
            </div>

            {/* SHARED MODAL OVERLAY */}
            {modal.type && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-md p-6">
                    <div className="bg-white w-full max-w-xl rounded-[48px] overflow-hidden shadow-2xl p-16 relative">
                        <button onClick={() => setModal({ type: null })} className="absolute top-10 right-10 text-slate-300 hover:text-slate-900 transition-colors"><X className="w-8 h-8" /></button>

                        {modal.type === 'delete' ? (
                            <div className="text-center">
                                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8"><Trash2 className="w-10 h-10" /></div>
                                <h2 className="text-4xl font-black text-slate-900 mb-4">Are you sure?</h2>
                                <p className="text-slate-500 mb-12 font-bold">This will permanently delete "{selectedLocation?.name}".</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setModal({ type: null })} className="flex-1 py-5 bg-slate-100 rounded-2xl font-black text-slate-600 hover:bg-slate-200">CANCEL</button>
                                    <button onClick={() => deleteMutation.mutate()} className="flex-1 py-5 bg-red-600 rounded-2xl font-black text-white hover:bg-red-700 shadow-xl shadow-red-600/30">DELETE NOW</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">
                                    {modal.type === 'add-item' ? 'New Item' : modal.type === 'edit' ? 'Update Location' : 'New Location'}
                                </h2>
                                <p className="text-slate-500 mb-10 font-bold uppercase text-[11px] tracking-widest">
                                    {modal.type === 'add-item' ? `Stored in ${selectedLocation?.name}` : modal.parentId ? `Sub-location of ${selectedLocation?.name}` : 'Main Storage Zone'}
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Name</label>
                                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 font-bold outline-none" placeholder="Enter name..." />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Description</label>
                                        <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 font-bold outline-none h-32" placeholder="Optional details..." />
                                    </div>
                                    {modal.type === 'add-item' && (
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quantity</label>
                                            <input type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none" />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => modal.type === 'add-item' ? addItemMutation.mutate(formData) : locationMutation.mutate(formData)}
                                        className="w-full py-5 bg-[#0F172A] text-white rounded-[24px] font-black text-lg hover:bg-primary-600 transition-all shadow-2xl flex items-center justify-center gap-3"
                                    >
                                        <Save className="w-6 h-6" /> {modal.type === 'edit' ? 'UPDATE' : 'CREATE'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    );
}

const StatBox = ({ label, value }: any) => (
    <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className="text-3xl font-black text-slate-900 leading-none">{value}</p>
    </div>
);