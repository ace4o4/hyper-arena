import { motion } from "framer-motion";

export const CardSkeleton = () => (
  <div className="glass rounded-xl p-6 animate-pulse">
    <div className="h-4 bg-muted/50 rounded w-3/4 mb-4" />
    <div className="h-8 bg-muted/50 rounded w-1/2 mb-4" />
    <div className="h-3 bg-muted/50 rounded w-full mb-2" />
    <div className="h-3 bg-muted/50 rounded w-2/3" />
  </div>
);

export const StatSkeleton = () => (
  <div className="glass rounded-xl p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-muted/50 rounded-lg" />
      <div className="w-10 h-4 bg-muted/50 rounded" />
    </div>
    <div className="h-8 bg-muted/50 rounded w-1/2 mb-2" />
    <div className="h-4 bg-muted/50 rounded w-3/4" />
  </div>
);

export const TournamentCardSkeleton = () => (
  <div className="glass rounded-xl overflow-hidden animate-pulse">
    <div className="h-40 bg-muted/30" />
    <div className="p-6">
      <div className="h-6 bg-muted/50 rounded w-3/4 mb-3" />
      <div className="h-4 bg-muted/50 rounded w-1/2 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 bg-muted/50 rounded-full" />
        <div className="h-6 w-20 bg-muted/50 rounded-full" />
      </div>
      <div className="h-2 bg-muted/50 rounded-full mb-4" />
      <div className="h-10 bg-muted/50 rounded" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 glass rounded-lg animate-pulse">
    <div className="w-8 h-8 bg-muted/50 rounded-full" />
    <div className="w-10 h-10 bg-muted/50 rounded-full" />
    <div className="flex-1">
      <div className="h-4 bg-muted/50 rounded w-1/3 mb-2" />
      <div className="h-3 bg-muted/50 rounded w-1/4" />
    </div>
    <div className="h-6 w-16 bg-muted/50 rounded" />
  </div>
);

export const PageSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen bg-background p-8"
  >
    {/* Header skeleton */}
    <div className="animate-pulse mb-12">
      <div className="h-12 bg-muted/30 rounded w-1/3 mb-4" />
      <div className="h-6 bg-muted/30 rounded w-1/4" />
    </div>
    
    {/* Stats grid skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {[...Array(4)].map((_, i) => (
        <StatSkeleton key={i} />
      ))}
    </div>
    
    {/* Content skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <TournamentCardSkeleton key={i} />
      ))}
    </div>
  </motion.div>
);

export const DashboardSkeleton = () => (
  <div className="pt-24 pb-12 px-4 min-h-screen">
    <div className="container mx-auto max-w-7xl">
      {/* Header skeleton */}
      <div className="animate-pulse mb-12">
        <div className="h-14 bg-muted/30 rounded w-1/2 mb-4" />
        <div className="h-6 bg-muted/30 rounded w-1/4" />
      </div>
      
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);