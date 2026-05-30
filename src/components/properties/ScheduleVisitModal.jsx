'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useScheduleVisitMutation } from '@/store/services/visitApi';
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

export function ScheduleVisitModal({ isOpen, onClose, property }) {
  const user = useSelector(selectCurrentUser);
  const [createVisit, { isLoading: isSubmitting }] = useScheduleVisitMutation();

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    visitDate: '',
    visitTime: '',
    visitType: 'concierge',
    notes: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const visitTypes = [
    {
      value: 'concierge',
      label: 'Guided Visit',
      description: 'A KamerNdah agent accompanies you on-site.',
      badge: '5,000 XAF'
    },
    {
      value: 'self-service',
      label: 'Self-Guided',
      description: 'Contact the landlord directly to arrange access.',
      badge: 'Free'
    }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await createVisit({
        property_id: property.id,
        user_id: user?.uid,
        landlord_id: property.landlord_id,
        visitor_name: formData.name,
        visitor_email: formData.email,
        visitor_phone: formData.phone,
        scheduled_date: formData.visitDate,
        scheduled_time: formData.visitTime,
        visit_type: formData.visitType,
        notes: formData.notes,
      }).unwrap();
      setIsSuccess(true);
    } catch (err) {
      setError(err?.data?.message || 'Failed to schedule visit. Please try again.');
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-background/90 backdrop-blur-xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#0c0c0e] border border-white/10 rounded-[2.5rem] overflow-hidden premium-shadow max-h-[90vh] overflow-y-auto"
      >
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center space-y-8 p-14"
            >
              <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Visit Scheduled</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your visit request for <span className="text-white font-bold">{property.title}</span> has been submitted. We'll confirm the details shortly.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs emerald-glow"
              >
                Done
              </button>
            </motion.div>
          ) : (
            <motion.div key="form">
              {/* Header */}
              <div className="flex items-start justify-between p-8 pb-6 border-b border-white/5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-light mb-1">Schedule a Visit</p>
                  <h2 className="text-xl font-black text-white tracking-tight line-clamp-1">{property.title}</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-gray-500 hover:text-white mt-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center space-x-3 text-sm font-medium">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Your Details</p>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-5 text-white font-medium text-sm placeholder:text-gray-700 focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Email"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-5 text-white font-medium text-sm placeholder:text-gray-700 focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                    <div className="relative group">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+237 XXX XXX"
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-5 text-white font-medium text-sm placeholder:text-gray-700 focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Visit Type */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Visit Type</p>
                  <div className="grid grid-cols-2 gap-3">
                    {visitTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('visitType', type.value)}
                        className={`p-5 rounded-2xl border text-left transition-all ${
                          formData.visitType === type.value
                            ? 'bg-primary/10 border-primary text-white'
                            : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                        }`}
                      >
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full mb-3 inline-block ${
                          formData.visitType === type.value ? 'bg-primary/20 text-primary-light' : 'bg-white/10 text-gray-500'
                        }`}>{type.badge}</span>
                        <p className="font-black text-sm text-white">{type.label}</p>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Date & Time</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                      <input
                        type="date"
                        required
                        value={formData.visitDate}
                        onChange={(e) => handleInputChange('visitDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-5 text-white font-medium text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none"
                      />
                    </div>
                    <div className="relative group">
                      <Clock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-primary transition-colors" />
                      <select
                        required
                        value={formData.visitTime}
                        onChange={(e) => handleInputChange('visitTime', e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-5 text-white font-medium text-sm focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-[#0c0c0e]">Select time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time} className="bg-[#0c0c0e]">{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Additional Notes <span className="text-gray-700 normal-case">(optional)</span></p>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    placeholder="Any special requirements or questions..."
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-5 text-white font-medium text-sm placeholder:text-gray-700 focus:outline-none focus:border-primary/50 transition-all resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 py-4 border border-white/10 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/5 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs emerald-glow flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Scheduling...</span>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>Confirm Visit</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}