'use client';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  ChevronLeft,
  Calendar,
  Building2,
  Key,
  CreditCard,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useCreateBookingMutation } from '@/store/services/bookingApi';
import { useCreateTransactionMutation } from '@/store/services/transactionApi';
import { formatPrice } from '@/lib/utils';
import { showModal } from '@/store/slices/uiSlice';
import { MobileMoneyPayment } from '../shared/MobileMoneyPayment';

const STEPS = [
  { label: 'Agreement', icon: ShieldCheck },
  { label: 'Terms', icon: Calendar },
  { label: 'Payment', icon: CreditCard },
];

export function CreateBookingModal({ property, isOpen, onClose }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [createBooking] = useCreateBookingMutation();
  const [createTransaction] = useCreateTransactionMutation();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    booking_type: property?.category === 'for-rent' ? 'lease' : 'purchase',
    move_in_date: '',
    duration_months: 12,
    agreed_price: property?.price || 0,
    notes: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePaymentSuccess = async (paymentData) => {
    try {
      await createBooking({
        property_id: property?.id,
        user_id: user?.uid,
        ...formData,
      }).unwrap();

      await createTransaction({
        amount: 25000,
        transaction_type: 'platform_fee',
        property_id: property?.id,
        user_id: user?.uid,
        landlord_id: property?.landlord_id || '',
        service_details: {
          type: 'booking_deposit',
          booking_type: formData.booking_type,
          payment_data: paymentData,
        },
        extra_notes: `Commitment deposit for ${property?.title}`,
      }).unwrap();

      setIsSuccess(true);
    } catch (err) {
      dispatch(
        showModal({
          type: 'error',
          title: 'Booking Failed',
          message:
            err?.data?.error ||
            'Your legal commitment could not be processed.',
          actionText: 'Retry',
        })
      );
    }
  };

  if (!isOpen) return null;

  const title = property?.title || 'Property';
  const isLease = formData.booking_type === 'lease';

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="relative w-full md:max-w-lg bg-[#0c0c0e] border border-white/10 rounded-t-2xl md:rounded-2xl overflow-hidden max-h-[90dvh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 pt-5 pb-0 flex-shrink-0">
          <div className="min-w-0">
            <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
              {isSuccess ? 'Agreement Submitted' : 'Commitment'}
            </h2>
            <p className="text-[11px] text-white/40 font-medium mt-0.5 truncate max-w-[220px] md:max-w-none">
              {isSuccess
                ? 'We will finalize the verified documents'
                : `Secure ${title}`}
            </p>
          </div>
          {!isSuccess && (
            <button
              onClick={onClose}
              className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-white/40 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Step indicator */}
        {!isSuccess && (
          <div className="flex gap-1 px-4 md:px-6 pt-4 flex-shrink-0">
            {STEPS.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full h-1 rounded transition-all ${
                    i + 1 <= step ? 'bg-primary' : 'bg-white/5'
                  }`}
                />
                <span
                  className={`text-[8px] font-bold tracking-wider mt-0.5 ${
                    i + 1 === step ? 'text-white/60' : 'text-white/15'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-4 md:px-6 py-5">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-8"
              >
                <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20 mb-5">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Agreement Transmitted
                </h3>
                <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                  Your commitment to &quot;{title}&quot; has been recorded. Our concierge
                  will finalize the verified documents.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs tracking-wider"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <motion.div key={step}>
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                      <img
                        src={
                          property?.images?.[0] ||
                          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=200'
                        }
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        alt=""
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">{title}</p>
                        <p className="text-[10px] text-white/30 font-medium">
                          {formatPrice(property?.price)} FCFA
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'lease', label: 'Lease', icon: Key, desc: 'Secure for rent' },
                        { id: 'purchase', label: 'Acquire', icon: Building2, desc: 'Own the asset' },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() =>
                            setFormData({ ...formData, booking_type: type.id })
                          }
                          className={`p-4 rounded-xl border text-left transition-all ${
                            formData.booking_type === type.id
                              ? 'bg-primary/10 border-primary/30'
                              : 'bg-white/5 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div
                            className={`p-2 w-fit rounded-lg mb-2 ${
                              formData.booking_type === type.id
                                ? 'bg-primary text-white'
                                : 'bg-white/10 text-white'
                            }`}
                          >
                            <type.icon className="w-4 h-4" />
                          </div>
                          <h5 className="text-sm font-bold text-white">{type.label}</h5>
                          <p className="text-[10px] text-white/40 font-medium">{type.desc}</p>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      Next <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/30 tracking-wider uppercase">
                          Move-in Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary pointer-events-none" />
                          <input
                            type="date"
                            value={formData.move_in_date}
                            onChange={(e) =>
                              setFormData({ ...formData, move_in_date: e.target.value })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-3 text-sm text-white font-bold focus:outline-none focus:border-primary/50"
                          />
                        </div>
                      </div>
                      {isLease && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-white/30 tracking-wider uppercase">
                            Duration (months)
                          </label>
                          <input
                            type="number"
                            value={formData.duration_months}
                            onChange={(e) =>
                              setFormData({ ...formData, duration_months: Number(e.target.value) })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white font-bold focus:outline-none focus:border-primary/50"
                          />
                        </div>
                      )}
                    </div>

                    {/* Price review */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
                          <CreditCard className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold text-white/30 tracking-wider uppercase">
                            Agreed Price
                          </p>
                          <p className="text-sm md:text-base font-bold text-white truncate">
                            {formatPrice(formData.agreed_price)} FCFA
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 flex-shrink-0">
                        Fixed
                      </span>
                    </div>

                    <textarea
                      placeholder="Additional notes..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-primary/50 min-h-[60px] resize-none"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="px-4 py-3 rounded-xl border border-white/10 text-white/40 hover:text-white transition-all flex-shrink-0"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        className="flex-1 bg-primary text-white py-3 rounded-xl font-bold text-xs tracking-wider transition-all"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <MobileMoneyPayment
                    amount={25000}
                    description="Professional Commitment Deposit"
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setStep(2)}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
