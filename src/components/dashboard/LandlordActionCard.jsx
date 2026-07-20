'use client';
import { motion } from 'framer-motion';
import {
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Phone,
  MessageCircle,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const STATUS_COLORS = {
  requested: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  completed: 'bg-primary/10 text-primary border-primary/20',
  active: 'bg-primary/10 text-primary border-primary/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function LandlordActionCard({ item, type, onStatusUpdate, isUpdating }) {
  const isVisit = type === 'visit';
  const status = item.status;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0c0c0e] border border-white/[0.04] rounded-2xl p-6 space-y-6 hover:border-white/[0.08] transition-all"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/[0.04] rounded-xl flex items-center justify-center border border-white/[0.04] overflow-hidden flex-shrink-0">
            {item.user_photo ? (
              <img src={item.user_photo} className="w-full h-full object-cover" alt="" />
            ) : (
              <User className="w-6 h-6 text-white/20" />
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-primary tracking-wider uppercase mb-0.5">Request</p>
            <h4 className="text-base font-bold text-white">{item.user_name || 'Verified Client'}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${STATUS_COLORS[status]}`}>
                {status}
              </span>
              {isVisit && (
                <div className="flex items-center gap-1 text-white/30 text-[9px] font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(item.scheduled_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold text-white/30 tracking-wider uppercase">Property</p>
          <p className="text-sm font-bold text-white">{item.property_title}</p>
          <p className="text-[10px] text-white/20 font-medium">ID: {item.property_id?.slice(0, 8)}</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 border-t border-white/[0.04]">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 tracking-wider uppercase mb-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Status</span>
          </div>
          <p className="text-xs font-bold text-white/70">Identity Cleared</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 tracking-wider uppercase mb-1">
            <FileText className="w-3 h-3 text-amber-400" />
            <span>Type</span>
          </div>
          <p className="text-xs font-bold text-white">{isVisit ? 'Physical Audit' : `${item.booking_type || ''} Intent`}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-white/30 tracking-wider uppercase mb-1">
            <TrendingUp className="w-3 h-3 text-primary" />
            <span>Financial</span>
          </div>
          <p className="text-xs font-bold text-emerald-400">
            {isVisit ? 'Fee Cleared' : `${formatPrice(item.agreed_price)} Committed`}
          </p>
        </div>
      </div>

      {/* Notes */}
      {item.notes && (
        <div className="bg-white/[0.04] p-4 rounded-xl border border-white/[0.04] text-xs text-white/40 leading-relaxed">
          &ldquo;{item.notes}&rdquo;
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-5 border-t border-white/[0.04]">
        <div className="flex items-center gap-3">
          <button className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/10 hover:bg-emerald-500/20 transition-all">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-3 bg-primary/10 text-primary rounded-xl border border-primary/10 hover:bg-primary/20 transition-all">
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {(status === 'requested' || status === 'pending') && (
            <>
              <button
                disabled={isUpdating}
                onClick={() => onStatusUpdate(item.id, 'cancelled')}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl border border-red-500/20 text-red-400 text-[10px] font-bold tracking-wider hover:bg-red-500/10 transition-all disabled:opacity-50"
              >
                Decline
              </button>
              <button
                disabled={isUpdating}
                onClick={() => onStatusUpdate(item.id, 'confirmed')}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-emerald-500 text-white text-[10px] font-bold tracking-wider hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isVisit ? 'Confirm' : 'Approve'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {status === 'confirmed' && (
            <button
              disabled={isUpdating}
              onClick={() => onStatusUpdate(item.id, isVisit ? 'completed' : 'active')}
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-primary text-white text-[10px] font-bold tracking-wider hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark {isVisit ? 'Concluded' : 'Active'}</span>
            </button>
          )}

          {(status === 'completed' || status === 'active' || status === 'cancelled') && (
            <div className="flex items-center gap-2 text-white/30 text-[10px] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Archived</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
