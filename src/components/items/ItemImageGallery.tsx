import { Package, Plus } from 'lucide-react';

interface ItemImageGalleryProps {
    itemId: string;
    itemName: string;
    imageId: string | null;
    attachments: any[];
    selectedImageId: string | null;
    onSelectImage: (id: string) => void;
    onAddAttachment: () => void;
    getImageUrl: (attachmentId: string) => string;
}

/**
 * ItemImageGallery Component
 * Displays main image with thumbnail gallery
 */
export function ItemImageGallery({
    itemId,
    itemName,
    imageId,
    attachments,
    selectedImageId,
    onSelectImage,
    onAddAttachment,
    getImageUrl
}: ItemImageGalleryProps) {
    const currentImageId = selectedImageId || imageId;

    return (
        <div className="space-y-4">
            {/* Main Image Display */}
            <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center overflow-hidden">
                {currentImageId ? (
                    <img
                        src={getImageUrl(currentImageId)}
                        alt={itemName}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="w-24 h-24 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/></svg></div>';
                        }}
                    />
                ) : (
                    <Package className="w-24 h-24 text-gray-300" />
                )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto">
                {imageId && (
                    <button
                        onClick={() => onSelectImage(imageId)}
                        className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${(!selectedImageId || selectedImageId === imageId)
                            ? 'border-blue-500'
                            : 'border-gray-200'
                            }`}
                    >
                        <img
                            src={getImageUrl(imageId)}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </button>
                )}
                {attachments?.map((att: any) => (
                    <button
                        key={att.id}
                        onClick={() => onSelectImage(att.id)}
                        className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${selectedImageId === att.id
                            ? 'border-blue-500'
                            : 'border-gray-200'
                            }`}
                    >
                        <img
                            src={getImageUrl(att.id)}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
                <button
                    onClick={onAddAttachment}
                    className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 flex-shrink-0"
                >
                    <Plus className="w-6 h-6 text-gray-400" />
                </button>
            </div>
        </div>
    );
}
