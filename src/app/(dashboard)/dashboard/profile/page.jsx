'use client';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Phone,
  Mail,
  Save,
  UserCheck,
  Building2,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/store/services/userApi';
import { showModal } from '@/store/slices/uiSlice';
import { DashboardPageHeader } from '@/components/dashboard/DashboardPageHeader';

export default function ProfileSettingsPage() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const { data: profileData, isLoading: isProfileLoading } = useGetUserByIdQuery(user?.uid, { skip: !user?.uid });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    displayName: profileData?.data?.displayName || '',
    phone: profileData?.data?.phone || '',
    role: profileData?.data?.role || 'renter',
    bio: profileData?.data?.bio || '',
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ id: user.uid, ...formData }).unwrap();
      dispatch(
        showModal({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been successfully updated.',
          actionText: 'View Dashboard',
          redirect: '/dashboard',
        }),
      );
    } catch (err) {
      dispatch(
        showModal({
          type: 'error',
          title: 'Update Failed',
          message: err?.data?.error || 'Could not update profile.',
          actionText: 'Retry',
        }),
      );
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-white/30 text-[10px] font-bold tracking-wider uppercase">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 pb-16">
      <DashboardPageHeader
        pill="Settings"
        title="Profile"
        highlight="Configuration."
        description="Manage your identity and how others see you on the platform."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar & Role */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0c0c0e] border border-white/[0.04] rounded-2xl p-8 flex flex-col items-center text-center gap-5">
            <div className="relative">
              <div className="w-24 h-24 bg-primary/15 rounded-2xl flex items-center justify-center border border-primary/10">
                <UserIcon className="w-10 h-10 text-primary" />
              </div>
              <button className="absolute -bottom-1 -right-1 p-2.5 bg-white text-black rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{formData.displayName || 'Unnamed'}</h3>
              <p className="text-xs text-white/30 mt-0.5">{user?.email}</p>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full border text-[10px] font-bold tracking-wider ${
                formData.role === 'landlord'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
              }`}
            >
              {formData.role === 'landlord' ? 'Landlord' : 'Verified Renter'}
            </span>
          </div>

          <div className="bg-white/[0.04] border border-white/[0.04] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-[10px] font-bold tracking-wider">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Note</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              Landlords can list properties, while Renters gain priority audit access.
            </p>
          </div>
        </div>

        {/* Settings form */}
        <form onSubmit={handleUpdate} className="lg:col-span-2 space-y-6">
          <div className="bg-[#0c0c0e] border border-white/[0.04] rounded-2xl p-6 md:p-8 space-y-6">
            {/* Role */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/30 tracking-wider uppercase ml-1">Persona</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'renter', label: 'Renter / Buyer', icon: UserCheck, desc: 'Find and audit estates.' },
                  { id: 'landlord', label: 'Landlord / Agent', icon: Building2, desc: 'List and manage assets.' },
                ].map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.id })}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                      formData.role === role.id
                        ? 'bg-primary/10 border-primary/25 text-white'
                        : 'bg-white/[0.04] border-white/[0.06] text-white/40 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl ${
                        formData.role === role.id ? 'bg-primary text-white' : 'bg-white/[0.06] text-white/30'
                      }`}
                    >
                      <role.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-wider">{role.label}</p>
                      <p className="text-[10px] text-white/30">{role.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 tracking-wider uppercase ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl py-3 pl-11 pr-4 text-white font-medium text-sm focus:outline-none focus:border-primary/40 transition-colors"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/30 tracking-wider uppercase ml-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl py-3 pl-11 pr-4 text-white font-medium text-sm focus:outline-none focus:border-primary/40 transition-colors"
                    placeholder="+237 ..."
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 tracking-wider uppercase ml-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 text-white font-medium text-sm focus:outline-none focus:border-primary/40 min-h-[100px] resize-none"
                placeholder="Brief summary of your real estate goals..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl font-bold text-xs tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
