import { PropertyCard } from './PropertyCard';
import { motion } from 'framer-motion';
import { Sparkles, XCircle } from 'lucide-react';

export function PropertyGrid({ properties: rawProperties, loading, emptyMessage }) {
  const properties = Array.isArray(rawProperties) ? rawProperties : [];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm animate-pulse flex flex-col"
          >
            <div className="aspect-[4/3] bg-gray-200 flex-shrink-0" />
            <div className="p-4 md:p-5 flex flex-col flex-1">
              <div className="space-y-2 mb-3">
                <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
              </div>
              <div className="flex gap-1.5 mb-3">
                <div className="h-5 bg-gray-100 rounded-md w-14" />
                <div className="h-5 bg-gray-100 rounded-md w-16" />
              </div>
              <div className="flex items-center gap-3 py-2.5 border-t border-gray-100 mb-3">
                <div className="flex-1 flex justify-center">
                  <div className="h-3.5 bg-gray-100 rounded-lg w-12" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="h-3.5 bg-gray-100 rounded-lg w-12" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="h-3.5 bg-gray-100 rounded-lg w-12" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                <div className="space-y-1">
                  <div className="h-2 bg-gray-100 rounded w-10" />
                  <div className="h-4 bg-gray-200 rounded-lg w-20" />
                </div>
                <div className="h-8 bg-gray-200 rounded-lg w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 md:py-20 bg-white border border-gray-200 rounded-2xl shadow-sm px-6 relative overflow-hidden">
        <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-5 text-gray-400">
          <XCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          No Properties Found
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
          {emptyMessage}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-100 border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-xs tracking-wider hover:bg-gray-200 transition-all"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
          },
        }}
      >
        {properties.map((property) => (
          <motion.div
            key={property.id}
            variants={{
              hidden: { y: 30, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <PropertyCard property={property} />
          </motion.div>
        ))}
      </motion.div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-2 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Showing {properties.length} Premium Propert{properties.length === 1 ? 'y' : 'ies'}
          </p>
        </div>
      </div>
    </div>
  );
}
