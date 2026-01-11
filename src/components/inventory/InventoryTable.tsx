import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { API_BASE_URL } from '../../lib/api';

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

interface InventoryTableProps {
    items: Item[];
    selectedItems: string[];
    onSelectAll: () => void;
    onDelete: (id: string) => void;
    attachmentToken: string | null;
}

/**
 * InventoryTable Component
 * Displays items in a tabular format with selection and actions
 */
export function InventoryTable({
    items,
    selectedItems,
    onSelectAll,
    onDelete,
    attachmentToken
}: InventoryTableProps) {
    const navigate = useNavigate();
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Delete this item?')) {
            onDelete(id);
        }
    };

    const getFullLocationPath = (location?: { id: string; name: string }): string => {
        if (!location) return 'N/A';
        return location.name || 'N/A';
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="w-12 px-6 py-3">
                            <input
                                type="checkbox"
                                checked={items.length > 0 && selectedItems.length === items.length}
                                onChange={onSelectAll}
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
                    {items && items.length > 0 ? (
                        items.map((item) => (
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
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg shrink-0 overflow-hidden">
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
                                            item.labels.slice(0, 3).map((label) => (
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
    );
}
