interface ItemTabsProps {
    activeTab: 'details' | 'attachments' | 'activity';
    onTabChange: (tab: 'details' | 'attachments' | 'activity') => void;
    attachmentCount: number;
    children: React.ReactNode;
}

/**
 * ItemTabs Component
 * Tab navigation for item details, attachments, and activity
 */
export function ItemTabs({ activeTab, onTabChange, attachmentCount, children }: ItemTabsProps) {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 bg-white">
                <button
                    onClick={() => onTabChange('details')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Details
                </button>
                <button
                    onClick={() => onTabChange('attachments')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'attachments'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Attachments
                    {attachmentCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                            {attachmentCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => onTabChange('activity')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'activity'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Activity
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 bg-white">
                {children}
            </div>
        </div>
    );
}
