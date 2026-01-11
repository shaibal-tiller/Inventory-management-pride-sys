import { Link } from 'react-router-dom';
import { ChevronRight, Edit, Trash2, Paperclip } from 'lucide-react';

interface ItemDetailHeaderProps {
    itemName: string;
    isEditMode: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onAddAttachment: () => void;
    onCancelEdit: () => void;
    onSaveEdit: () => void;
}

/**
 * ItemDetailHeader Component
 * Breadcrumb navigation and action buttons for item detail page
 */
export function ItemDetailHeader({
    itemName,
    isEditMode,
    onEdit,
    onDelete,
    onAddAttachment,
    onCancelEdit,
    onSaveEdit
}: ItemDetailHeaderProps) {
    return (
        <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2 text-sm">
                <Link to="/inventory" className="text-gray-500 hover:text-gray-700">
                    Inventory
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">{itemName}</span>
            </div>

            <div className="flex items-center gap-2">
                {!isEditMode ? (
                    <>
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Edit className="w-4 h-4 text-gray-700" />
                            <span className="text-sm font-medium text-gray-700">Edit</span>
                        </button>
                        <button
                            onClick={onAddAttachment}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Paperclip className="w-4 h-4 text-gray-700" />
                            <span className="text-sm font-medium text-gray-700">Add Attachment</span>
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-600">Delete</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={onCancelEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-sm font-medium text-gray-700">Cancel</span>
                        </button>
                        <button
                            onClick={onSaveEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <span className="text-sm font-medium">Save Changes</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
