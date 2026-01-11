import { ChevronRight, MapPin } from 'lucide-react';
import { TreeItem } from '../../lib/api';

interface LocationTreeNodeProps {
    node: TreeItem;
    level: number;
    selectedLocationId: string | null;
    expandedNodes: Set<string>;
    onSelectLocation: (id: string) => void;
    onToggleNode: (id: string) => void;
}

/**
 * LocationTreeNode Component
 * Recursive tree node for displaying location hierarchy
 */
export function LocationTreeNode({
    node,
    level,
    selectedLocationId,
    expandedNodes,
    onSelectLocation,
    onToggleNode
}: LocationTreeNodeProps) {
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedLocationId === node.id;
    const hasChildren = node.children && node.children.length > 0;

    // Generate consistent color based on node id
    const getIconColor = () => {
        const colors = [
            'text-blue-500',
            'text-green-500',
            'text-purple-500',
            'text-orange-500',
            'text-teal-500',
            'text-pink-500',
            'text-indigo-500',
            'text-amber-500'
        ];
        const hash = node.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const iconColor = getIconColor();

    const handleClick = () => {
        if (node.type === 'location') onSelectLocation(node.id);
        if (hasChildren) onToggleNode(node.id);
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                    isSelected
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                }`}
                style={{ paddingLeft: `${12 + level * 16}px` }}
            >
                {hasChildren && (
                    <ChevronRight
                        className={`w-4 h-4 transition-transform text-gray-400 ${
                            isExpanded ? 'rotate-90' : ''
                        }`}
                    />
                )}
                {!hasChildren && <div className="w-4" />}
                <MapPin className={`w-4 h-4 ${isSelected ? 'text-blue-600' : iconColor}`} />
                <span className="truncate flex-1 text-left">{node.name}</span>
                {node.type === 'location' && (
                    <span className="text-xs text-gray-500">{node.children?.length || 0}</span>
                )}
            </button>

            {/* Render children recursively */}
            {isExpanded && hasChildren && (
                <div>
                    {node.children?.map((child) => (
                        <LocationTreeNode
                            key={child.id}
                            node={child}
                            level={level + 1}
                            selectedLocationId={selectedLocationId}
                            expandedNodes={expandedNodes}
                            onSelectLocation={onSelectLocation}
                            onToggleNode={onToggleNode}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
