'use client';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  X,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useScheduleVisitMutation } from '@/store/services/visitApi';
import { useCreateTransactionMutation } from '@/store/services/transactionApi';
import { showModal } from '@/store/slices/uiSlice';
import { MobileMoneyPayment } from '../shared/MobileMoneyPayment';

const STEPS = [
  { label: 'Date & Time', icon: Calendar },
  { label: 'Visit Type', icon: User },
  { label: 'Payment', icon: MapPin },
];

export function VisitScheduleModal({ property, isOpen, onClose }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [scheduleVisit] = useScheduleVisitMutation();
  const [createTransaction] = useCreateTransactionMutation();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    time: '10:00',
    visitType: 'physical',
    notes: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const scheduledDate = `${formData.date}T${formData.time}:00`;
      await scheduleVisit({
        property_id: property?.id,
        user_id: user?.uid,
        scheduled_date: scheduledDate,
        visit_type: formData.visitType,
        notes: formData.notes,
      }).unwrap();

      await createTransaction({
        amount: 2500,
        transaction_type: 'visit_fee',
        property_id: property?.id,
        user_id: user?.uid,
        landlord_id: property?.landlord_id || '',
        service_details: {
          type: 'property_audit',
          visit_type: formData.visitType,
          payment_data: paymentData,
        },
        extra_notes: `Audit clearance for ${property?.title}`,
      }).unwrap();

      setIsSuccess(true);
    } catch (err) {
      dispatch(
        showModal({
          type: 'error',
          title: 'Audit Failed',
          message:
            err?.data?.error ||
            'We could not process your audit request. Please try again.',
          actionText: 'Retry',
        })
      );
    }
  };

  if (!isOpen) return null;

  const title = property?.title || 'Property';

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
              {isSuccess ? 'Visit Scheduled' : 'Schedule Visit'}
            </h2>
            <p className="text-[11px] text-white/40 font-medium mt-0.5 truncate max-w-[220px] md:max-w-none">
              {isSuccess
                ? "We'll confirm with the owner"
                : `Arrange a viewing for ${title}`}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center py-8"
              >
                <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20 mb-5">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Request Received
                </h3>
                <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                  The owner of &quot;{title}&quot; has been notified. We&apos;ll update you
                  once the viewing is confirmed.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs tracking-wider"
                >
                  Close
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
                        <p className="text-sm font-bold text-white truncate">
                          {title}
                        </p>
                        <p className="text-[10px] text-white/30 font-medium">Property Visit</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary pointer-events-none" />
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-3 text-sm text-white font-bold focus:outline-none focus:border-primary/50 transition-all"
                        />
                      </div>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary pointer-events-none" />
                        <select
                          value={formData.time}
                          onChange={(e) =>
                            setFormData({ ...formData, time: e.target.value })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-3 text-sm text-white font-bold focus:outline-none focus:border-primary/50 transition-all appearance-none"
                        >
                          {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map(
                            (t) => (
                              <option key={t} value={t} className="bg-[#0c0c0e]">
                                {t}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      disabled={!formData.date}
                      className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      Next
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: 'physical', title: 'On-Site Inspection', desc: 'Full physical walkthrough.', icon: MapPin },
                        { id: 'assisted', title: 'Agent Assisted', desc: 'Virtual guided tour.', icon: User },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() =>
                            setFormData({ ...formData, visitType: type.id })
                          }
                          className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                            formData.visitType === type.id
                              ? 'bg-primary/10 border-primary/30'
                              : 'bg-white/5 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg flex-shrink-0 ${
                              formData.visitType === type.id
                                ? 'bg-primary text-white'
                                : 'bg-white/10'
                            }`}
                          >
                            <type.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-bold text-white">{type.title}</h5>
                            <p className="text-[11px] text-white/40 font-medium">{type.desc}</p>
                          </div>
                          {formData.visitType === type.id && (
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                          )}
                        </button>
                      ))}
                    </div>

                    <textarea
                      placeholder="Special notes or requests..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-primary/50 min-h-[70px] resize-none"
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
                    amount={2500}
                    description="Property Audit Clearance Fee"
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
