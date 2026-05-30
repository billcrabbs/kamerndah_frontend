'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X, ArrowRight, RefreshCcw } from 'lucide-react';

export function FeedbackModal({ 
  isOpen, 
  onClose, 
  type = 'success', 
  title, 
  message, 
  actionText, 
  onAction 
}) {
  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden premium-shadow"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-10 flex flex-col items-center text-center">
          {/* Icon Section */}
          <div className={`w-24 h-24 rounded-full flex items-center justify-center border relative mb-8 ${
            isSuccess 
              ? 'bg-primary/20 border-primary/20 text-primary-light' 
              : 'bg-red-500/20 border-red-500/20 text-red-500'
          }`}>
            <div className={`absolute inset-0 blur-2xl rounded-full ${
              isSuccess ? 'bg-primary/20' : 'bg-red-500/20'
            }`} />
            {isSuccess ? (
              <CheckCircle2 className="w-12 h-12 relative z-10" />
            ) : (
              <XCircle className="w-12 h-12 relative z-10" />
            )}
          </div>

          {/* Content */}
          <div className="space-y-3 mb-10">
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
              {title || (isSuccess ? 'Success!' : 'System Error')}
            </h3>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              {message}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={onAction || onClose}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center space-x-3 ${
              isSuccess 
                ? 'bg-primary text-white emerald-glow hover:bg-primary-dark' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isSuccess ? (
              <>
                <span>{actionText || 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <RefreshCcw className="w-4 h-4" />
                <span>{actionText || 'Try Again'}</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
