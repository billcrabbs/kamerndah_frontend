'use client';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  CreditCard,
  ArrowUpRight,
  Download,
  Search,
  Filter,
  History,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useGetTransactionsByUserQuery } from '@/store/services/transactionApi';
import { formatPrice } from '@/lib/utils';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

const STATUS_STYLES = {
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const getStatusStyle = (status) => STATUS_STYLES[status] || 'bg-white/[0.04] text-white/40 border-white/10';

export default function TransactionsPage() {
  const user = useSelector(selectCurrentUser);
  const { data: transactionsData, isLoading } = useGetTransactionsByUserQuery(user?.uid, { skip: !user?.uid });

  const transactions = transactionsData?.data || [];
  const completedTransactions = transactions.filter((t) => t.status === 'completed');
  const totalDeployed = completedTransactions.reduce((acc, t) => acc + t.amount, 0);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 bg-white/[0.04] rounded-2xl" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-white/[0.04] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <DashboardPageHeader
        pill="Finance"
        title="Asset"
        highlight="Transactions."
        description="Track your payments and financial commitments."
      />

      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0c0c0e] border border-white/[0.04] rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/[0.04] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative space-y-6">
            <div className="flex items-center justify-between">
              <div className="bg-primary/15 p-3 rounded-xl">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <p className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">Verified</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/30 tracking-wider uppercase mb-1">Total Capital Deployed</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{formatPrice(totalDeployed)}</h2>
            </div>
            <div className="flex gap-8 pt-6 border-t border-white/[0.04]">
              <div>
                <p className="text-[10px] font-bold text-white/30 tracking-wider uppercase">Pending</p>
                <p className="text-xl font-bold text-white mt-1">{transactions.filter((t) => t.status === 'pending').length}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/30 tracking-wider uppercase">Completed</p>
                <p className="text-xl font-bold text-white mt-1">{completedTransactions.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.04] border border-white/[0.04] rounded-2xl p-6 flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-bold tracking-wider uppercase">Insight</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              All transactions are routed through secure, encrypted gateways.
            </p>
          </div>
          <button className="w-full bg-white/[0.06] hover:bg-white/[0.10] text-white py-3 rounded-xl text-[10px] font-bold tracking-wider transition-all">
            Request Statement
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-white/30" />
            <h3 className="text-sm font-bold text-white/70">History</h3>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white/[0.04] rounded-lg border border-white/[0.04] text-white/30 hover:text-white transition-all">
              <Filter className="w-3.5 h-3.5" />
            </button>
            <button className="p-2 bg-white/[0.04] rounded-lg border border-white/[0.04] text-white/30 hover:text-white transition-all">
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white/[0.04] border border-white/[0.04] rounded-2xl p-16 text-center">
            <div className="w-12 h-12 bg-white/[0.04] rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-5 h-5 text-white/20" />
            </div>
            <p className="text-sm font-bold text-white/50">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                className="bg-white/[0.04] border border-white/[0.04] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      transaction.type === 'payment' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {transaction.type === 'payment' ? <ArrowUpRight className="w-4 h-4" /> : <History className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{transaction.description || 'Transaction'}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">
                      {transaction.reference_id?.slice(0, 8)} &middot; {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="text-right">
                    <p className="text-base font-bold text-white">{formatPrice(transaction.amount)}</p>
                    <p className="text-[10px] text-white/30 font-medium">{transaction.payment_method || 'Mobile Money'}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold tracking-wider ${getStatusStyle(transaction.status)}`}>
                    {transaction.status}
                  </span>
                  <button className="hidden md:block p-2 text-white/20 hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Security Banner */}
      <div className="bg-primary/[0.04] border border-primary/[0.12] rounded-2xl p-5 flex items-center gap-4">
        <div className="p-2.5 bg-primary/15 rounded-xl text-primary flex-shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Secure Network</p>
          <p className="text-[10px] text-white/30 font-medium mt-0.5">Encrypted via MTN / Orange Money</p>
        </div>
      </div>
    </div>
  );
}
