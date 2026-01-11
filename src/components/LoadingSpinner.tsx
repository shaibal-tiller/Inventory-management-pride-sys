import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        <p className="text-slate-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 h-12" />
      
      {/* Rows */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="border-b border-slate-200 h-28 p-6 flex items-center gap-4"
        >
          <div className="w-4 h-4 bg-slate-200 rounded animate-pulse" />
          <div className="w-12 h-12 bg-slate-200 rounded animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-2 animate-pulse" />
            <div className="h-3 bg-slate-200 rounded w-1/4 animate-pulse" />
          </div>
          <div className="w-32 h-4 bg-slate-200 rounded animate-pulse" />
          <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
          <div className="w-20 h-4 bg-slate-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}