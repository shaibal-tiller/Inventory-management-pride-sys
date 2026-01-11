import { Paperclip } from 'lucide-react';

interface ItemAttachmentsTabProps {
    attachments: any[];
    getImageUrl: (attachmentId: string) => string;
    onAddAttachment: () => void;
}

/**
 * ItemAttachmentsTab Component
 * Displays grid of attachments or empty state
 */
export function ItemAttachmentsTab({ attachments, getImageUrl, onAddAttachment }: ItemAttachmentsTabProps) {
    if (!attachments || attachments.length === 0) {
        return (
            <div className="text-center py-12">
                <Paperclip className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">No attachments yet</p>
                <button
                    onClick={onAddAttachment}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    Add your first attachment
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 gap-4">
            {attachments.map((att: any) => (
                <div
                    key={att.id}
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                >
                    <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                        <img
                            src={getImageUrl(att.id)}
                            alt={att.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {att.title || 'Untitled'}
                    </p>
                </div>
            ))}
        </div>
    );
}
