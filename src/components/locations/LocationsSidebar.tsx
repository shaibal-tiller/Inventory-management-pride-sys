import { Search, Plus } from 'lucide-react';
import { TreeItem } from '../../lib/api';
import { LocationTreeNode } from './LocationTreeNode';

interface LocationsSidebarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onNewLocation: () => void;
    locationTree: TreeItem[] | undefined;
    selectedLocationId: string | null;
    expandedNodes: Set<string>;
    onSelectLocation: (id: string) => void;
    onToggleNode: (id: string) => void;
}

/**
 * LocationsSidebar Component
 * Displays search, tree view, and new location button
 */
export function LocationsSidebar({
    searchQuery,
    onSearchChange,
    onNewLocation,
    locationTree,
    selectedLocationId,
    expandedNodes,
    onSelectLocation,
    onToggleNode
}: LocationsSidebarProps) {
    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="py-4">
                {/* Search Input */}
                <div className="relative mb-3 px-4">
                    <input
                        type="text"
                        placeholder="Search locations..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <Search className="mx-4 absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                <div className="border-t border-gray-200 my-3 w-full"></div>

                {/* New Location Button */}
                <button
                    onClick={onNewLocation}
                    className="mx-4 w-[calc(100%-32px)] py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Location
                </button>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Location Tree */}
            <div className="flex-1 overflow-auto p-2">
                {locationTree?.map((node) => (
                    <LocationTreeNode
                        key={node.id}
                        node={node}
                        level={0}
                        selectedLocationId={selectedLocationId}
                        expandedNodes={expandedNodes}
                        onSelectLocation={onSelectLocation}
                        onToggleNode={onToggleNode}
                    />
                ))}
            </div>
        </div>
    );
}
