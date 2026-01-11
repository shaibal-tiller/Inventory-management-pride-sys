import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    ChevronRight,
    Edit,
    Trash2,
    Plus,
    MapPin,
    Calendar,
    DollarSign,
    Shield,
    FileText,
    Paperclip,
    Activity,
    Package,
} from 'lucide-react';
import { api } from '../lib/api';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { format } from 'date-fns';

export default function ItemDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'details' | 'attachments' | 'activity'>('details');

    // Fetch item details
    const { data: item, isLoading, error } = useQuery({
        queryKey: ['item', id],
        queryFn: () => (id ? api.getItem(id) : null),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <Layout>
                <LoadingSpinner />
            </Layout>
        );
    }

    if (error || !item) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Failed to load item</p>
                        <button
                            onClick={() => navigate('/inventory')}
                            className="text-primary-600 hover:text-primary-700"
                        >
                            Back to Inventory
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="h-full overflow-auto">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                        <Link to="/inventory" className="hover:text-slate-700">
                            Inventory
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-slate-900 font-medium">{item.name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-semibold text-slate-900">{item.name}</h1>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-blue-50 text-primary-600 rounded-full text-sm font-medium">
                                    Electronics
                                </span>
                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                    Active Warranty
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                <Edit className="w-4 h-4" />
                                <span className="font-medium text-slate-700">Edit</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                                <Paperclip className="w-4 h-4" />
                                <span className="font-medium text-slate-700">Add Attachment</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors">
                                <Trash2 className="w-4 h-4" />
                                <span className="font-medium">Delete</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex">
                    {/* Left - Image & Info */}
                    <div className="w-[600px] p-6">
                        {/* Image */}
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
                            <div className="bg-slate-50 p-6 flex items-center justify-center" style={{ minHeight: '506px' }}>
                                {item.imageId ? (
                                    <img
                                        src={`${api}/v1/items/${item.id}/attachments/${item.imageId}`}
                                        alt={item.name}
                                        className="max-w-full max-h-[506px] object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-[506px] bg-slate-100 flex items-center justify-center">
                                        <Package className="w-24 h-24 text-slate-300" />
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            <div className="flex items-center gap-3 p-3">
                                <div className="w-[117px] h-[117px] border-2 border-primary-500 rounded-lg overflow-hidden">
                                    <div className="w-full h-full bg-slate-100" />
                                </div>
                                <div className="w-[117px] h-[117px] border border-slate-200 rounded-lg overflow-hidden">
                                    <div className="w-full h-full bg-slate-100" />
                                </div>
                                <div className="w-[117px] h-[117px] border border-slate-200 rounded-lg overflow-hidden">
                                    <div className="w-full h-full bg-slate-100" />
                                </div>
                                <button className="w-[117px] h-[117px] border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-100">
                                    <Plus className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right - Details */}
                    <div className="flex-1 p-6">
                        <div className="bg-white border border-slate-200 rounded-xl">
                            {/* Tabs */}
                            <div className="border-b border-slate-200 flex">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`px-6 py-4 font-medium border-b-2 transition-colors ${activeTab === 'details'
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('attachments')}
                                    className={`px-6 py-4 font-medium border-b-2 transition-colors ${activeTab === 'attachments'
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    Attachments
                                    <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">
                                        3
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('activity')}
                                    className={`px-6 py-4 font-medium border-b-2 transition-colors ${activeTab === 'activity'
                                            ? 'border-primary-500 text-primary-600'
                                            : 'border-transparent text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    Activity
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === 'details' && (
                                    <div className="space-y-6">
                                        {/* Key Details Card */}
                                        <div className="bg-white">
                                            <h3 className="text-lg font-semibold text-slate-900 mb-4">
                                                Key Details
                                            </h3>

                                            <div className="space-y-4">
                                                {/* Location */}
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-5 h-5 text-primary-600 mt-0.5" />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-700">Location</p>
                                                        <p className="text-slate-900">Living Room</p>
                                                    </div>
                                                </div>

                                                {/* Labels */}
                                                <div className="flex items-start gap-3">
                                                    <div className="w-5 h-5 flex items-center justify-center">
                                                        <div className="w-3 h-3 bg-primary-600 rounded-full" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-700">Labels</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="px-2.5 py-1 bg-blue-50 text-primary-600 rounded-md text-sm font-medium">
                                                                Electronics
                                                            </span>
                                                            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-sm font-medium">
                                                                Audio
                                                            </span>
                                                            <span className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md text-sm font-medium">
                                                                Premium
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quantity */}
                                                <div className="flex items-start gap-3">
                                                    <div className="w-5 h-5 flex items-center justify-center text-slate-600">
                                                        #
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-slate-700">Quantity</p>
                                                        <p className="text-slate-900">{item.quantity}</p>
                                                    </div>
                                                </div>

                                                {/* Purchase Date */}
                                                {item.purchaseTime && (
                                                    <div className="flex items-start gap-3">
                                                        <Calendar className="w-5 h-5 text-slate-600 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-slate-700">
                                                                Purchase Date
                                                            </p>
                                                            <p className="text-slate-900">
                                                                {format(new Date(item.purchaseTime), 'MMMM d, yyyy')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Purchase Price */}
                                                {item.purchasePrice && (
                                                    <div className="flex items-start gap-3">
                                                        <DollarSign className="w-5 h-5 text-slate-600 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-slate-700">
                                                                Purchase Price
                                                            </p>
                                                            <p className="text-lg font-semibold text-slate-900">
                                                                ${item.purchasePrice.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Warranty */}
                                                {item.warrantyExpires && (
                                                    <div className="flex items-start gap-3">
                                                        <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-slate-700">Warranty</p>
                                                            <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium mt-1">
                                                                Active until {format(new Date(item.warrantyExpires), 'MMMM d, yyyy')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Notes */}
                                                {item.notes && (
                                                    <div className="flex items-start gap-3">
                                                        <FileText className="w-5 h-5 text-slate-600 mt-0.5" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-slate-700 mb-1">Notes</p>
                                                            <p className="text-slate-600 leading-relaxed">{item.notes}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Information */}
                                        <div className="border-t border-slate-200 pt-6">
                                            <h3 className="text-sm font-semibold text-slate-900 mb-4">
                                                Product Information
                                            </h3>
                                            <div className="grid grid-cols-2 gap-y-4">
                                                <div>
                                                    <p className="text-sm text-slate-500">Brand</p>
                                                    <p className="font-medium text-slate-900">
                                                        {item.manufacturer || 'Sony'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Serial Number</p>
                                                    <p className="font-medium text-slate-900">
                                                        {item.serialNumber || '1234567890'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Model</p>
                                                    <p className="font-medium text-slate-900">
                                                        {item.modelNumber || 'WH-1000XM4'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Purchased From</p>
                                                    <p className="font-medium text-slate-900">Best Buy</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Color</p>
                                                    <p className="font-medium text-slate-900">Black</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Last Updated</p>
                                                    <p className="font-medium text-slate-900">
                                                        {format(new Date(item.updatedAt), 'MMM d, h:mm a')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'attachments' && (
                                    <div className="text-center py-12 text-slate-500">
                                        <Paperclip className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No attachments yet</p>
                                    </div>
                                )}

                                {activeTab === 'activity' && (
                                    <div className="text-center py-12 text-slate-500">
                                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No activity recorded</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}