import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ChevronRight, Edit, Trash2, Plus, MapPin, DollarSign,
    Shield, FileText, Package, Paperclip, Activity, X, Upload, Calendar, Tag, Info, CheckCircle
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
    const [uploading, setUploading] = useState(false);

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
        if (file) { setUploading(true); uploadMutation.mutate(file); }
    };

    if (isLoading) return <Layout><LoadingSpinner /></Layout>;
    if (error || !item) return <Layout><div className="p-8 text-center text-red-600 font-bold">Item not found.</div></Layout>;

    // Helpers for specific field extraction from API fields array
    const getFieldValue = (name: string) => item.fields?.find((f: any) => f.name.toLowerCase() === name.toLowerCase())?.textValue || '—';

    return (
        <Layout>
            <div className="h-full bg-[#F8FAFC] overflow-auto flex flex-col items-center">
                <div className="w-full max-w-[1440px] flex flex-col p-10 gap-10">

                    {/* 1. TOP HEADER SECTION */}
                    <div className="flex items-end justify-between">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[14px] text-slate-400 font-medium mb-2">
                                <Link to="/inventory" className="hover:text-primary-500">Inventory</Link>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-slate-900">{item.name}</span>
                            </div>
                            <h1 className="text-[42px] font-black text-[#0F172A] tracking-tighter leading-none">{item.name}</h1>
                            <div className="flex gap-2">
                                {item.labels.map((l: any) => (
                                    <span key={l.id} className="px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-wider"
                                        style={{ backgroundColor: `${l.color}15`, color: l.color, border: `1px solid ${l.color}40` }}>{l.name}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-4 pb-1">
                            <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-95"><Edit className="w-5 h-5" /> EDIT</button>
                            <button onClick={() => setIsAttachmentModalOpen(true)} className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-slate-700 hover:bg-slate-50 shadow-sm transition-all active:scale-95"><Paperclip className="w-5 h-5" /> ADD MEDIA</button>
                            <button onClick={() => setIsDeleteModalOpen(true)} className="flex items-center gap-2 px-6 py-3.5 bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3] rounded-2xl font-black hover:bg-[#FFE4E6] shadow-sm transition-all active:scale-95"><Trash2 className="w-5 h-5" /> DELETE</button>
                        </div>
                    </div>

                    {/* 2. MIDDLE ROW: SAME HEIGHT BOXES */}
                    <div className="flex flex-col lg:flex-row gap-10 items-stretch">
                        {/* LEFT: PHOTO & ATTACHMENT PREVIEW OVERLAY */}
                        <div className="flex-1 min-h-[580px] bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-xl relative group">
                            <div className="w-full h-full flex items-center justify-center bg-[#F1F5F9] p-12">
                                {item.imageId ? (
                                    <img src={`${API_BASE_URL}/v1/items/${item.id}/attachments/${item.imageId}?token=${attachmentToken}`}
                                        className="max-h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105" alt="" />
                                ) : <Package className="w-40 h-40 text-slate-200" />}
                            </div>

                            {/* ATTACHMENT PREVIEW OVERLAY AT BOTTOM */}
                            <div className="absolute bottom-6 left-6 right-6 flex gap-4 overflow-x-auto p-4 bg-white/40 backdrop-blur-xl border border-white/40 rounded-[32px] shadow-2xl">
                                {item.attachments?.map((att: any) => (
                                    <div key={att.id} className="w-20 h-20 rounded-2xl border-2 border-white shadow-lg flex-shrink-0 overflow-hidden hover:scale-110 transition-all cursor-pointer">
                                        <img src={`${API_BASE_URL}/v1/items/${item.id}/attachments/${att.id}?token=${attachmentToken}`} className="w-full h-full object-cover" alt="" />
                                    </div>
                                ))}
                                <button onClick={() => setIsAttachmentModalOpen(true)} className="w-20 h-20 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-all flex-shrink-0 active:scale-90">
                                    <Plus className="w-8 h-8" />
                                </button>
                            </div>
                        </div>

                        {/* RIGHT: KEY DETAILS BOX */}
                        <div className="w-full lg:w-[480px] bg-[#1E293B] rounded-[40px] p-10 shadow-2xl flex flex-col justify-between text-white">
                            <h2 className="text-2xl font-black flex items-center gap-3 mb-10 uppercase tracking-widest">
                                <div className="w-2 h-8 bg-primary-500 rounded-full" /> Key Details
                            </h2>
                            <div className="space-y-8 flex-1">
                                <DetailItem icon={<MapPin />} label="Location" value={item.location?.name || 'Unassigned'} />
                                <DetailItem icon={<Tag />} label="Labels" value={item.labels.map((l: any) => l.name).join(', ') || 'None'} />
                                <DetailItem icon={<Package />} label="Quantity" value={`${item.quantity} Units`} />
                                <DetailItem icon={<Calendar />} label="Purchased Date" value={item.purchaseTime ? format(new Date(item.purchaseTime), 'PPP') : '—'} />
                                <DetailItem icon={<DollarSign />} label="Purchased Price" value={item.purchasePrice ? `$${item.purchasePrice.toLocaleString()}` : '—'} />
                                <DetailItem icon={<Shield />} label="Warranty" value={item.warrantyExpires ? format(new Date(item.warrantyExpires), 'MMMM yyyy') : 'No Warranty'} />
                                <DetailItem icon={<FileText />} label="Notes" value={item.notes || '—'} />
                            </div>
                        </div>
                    </div>

                    {/* 3. BOTTOM BOX: TABS MATCHING WIDTH */}
                    <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-xl min-h-[500px]">
                        <div className="flex border-b bg-[#F8FAFC]">
                            {['details', 'attachments', 'activity'].map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab as any)}
                                    className={`px-12 py-7 text-[15px] font-black uppercase tracking-[0.2em] border-b-4 transition-all ${activeTab === tab ? 'border-primary-500 text-primary-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-16">
                            {activeTab === 'details' && (
                                <div className="grid grid-cols-2 gap-32">
                                    <div className="space-y-12">
                                        <SectionTitle title="Product Information" dotColor="bg-primary-500" />
                                        <div className="space-y-10">
                                            <TabRow label="Brand" value={item.manufacturer || '—'} />
                                            <TabRow label="Model" value={item.modelNumber || '—'} />
                                            <TabRow label="Color" value={getFieldValue('Color')} />
                                            <TabRow label="Condition" value={getFieldValue('Condition')} />
                                        </div>
                                    </div>
                                    <div className="space-y-12">
                                        <SectionTitle title="Additional Details" dotColor="bg-slate-300" />
                                        <div className="space-y-10">
                                            <TabRow label="Serial Number" value={item.serialNumber || '—'} />
                                            <TabRow label="Purchased From" value={item.purchaseFrom || '—'} />
                                            <TabRow label="Last Updated" value={format(new Date(item.updatedAt), 'PPP p')} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'attachments' && (
                                <div className="grid grid-cols-4 gap-8">
                                    {item.attachments?.map((att: any) => (
                                        <div key={att.id} className="border border-slate-200 rounded-[32px] p-6 flex flex-col items-center gap-4 bg-[#F8FAFC] hover:bg-white transition-colors cursor-pointer group">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                                                <Paperclip className="text-primary-500" />
                                            </div>
                                            <p className="font-bold text-slate-800 text-center truncate w-full">{att.title}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{att.mimeType}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MODAL OVERLAY: ATTACHMENT */}
                {isAttachmentModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-md p-6">
                        <div className="bg-white w-full max-w-xl rounded-[48px] overflow-hidden shadow-2xl p-16 relative animate-in zoom-in duration-300">
                            <button onClick={() => setIsAttachmentModalOpen(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-900 transition-colors"><X className="w-8 h-8" /></button>
                            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Add Media</h2>
                            <p className="text-slate-500 mb-12 text-lg font-medium">Upload photographs, manuals, or receipts.</p>
                            <div className="border-4 border-dashed border-slate-100 rounded-[40px] p-20 flex flex-col items-center justify-center bg-[#F8FAFC] hover:bg-white hover:border-primary-200 transition-all cursor-pointer group relative">
                                <Upload className="w-20 h-20 text-slate-200 group-hover:text-primary-500 mb-8 transition-colors" />
                                <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} />
                                <label htmlFor="file-upload" className="bg-[#0F172A] text-white px-10 py-5 rounded-[24px] font-black text-lg cursor-pointer hover:bg-primary-600 transition-all shadow-2xl">
                                    {uploading ? 'PROCESSING...' : 'BROWSE FILES'}
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

// UI HELPERS
const DetailItem = ({ icon, label, value }: any) => (
    <div className="flex items-center gap-6">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary-400 shadow-inner">{icon}</div>
        <div className="min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-[17px] font-bold truncate leading-none">{value}</p>
        </div>
    </div>
);

const SectionTitle = ({ title, dotColor }: any) => (
    <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${dotColor}`} />
        <h3 className="text-[22px] font-black text-slate-900 tracking-tight">{title}</h3>
    </div>
);

const TabRow = ({ label, value }: any) => (
    <div className="flex flex-col border-l-2 border-slate-100 pl-6 py-1">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-[18px] font-bold text-slate-800 leading-none">{value}</p>
    </div>
);