'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
 User as UserIcon, 
 Phone, 
 Mail, 
 Shield, 
 Save, 
 UserCheck, 
 Building2,
 AlertCircle,
 Sparkles,
 Camera
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { useGetUserByIdQuery, useUpdateUserMutation } from '@/store/services/userApi';
import { showModal } from '@/store/slices/uiSlice';

export default function ProfileSettingsPage() {
 const user = useSelector(selectCurrentUser);
 const dispatch = useDispatch();
 const { data: profileData, isLoading: isProfileLoading } = useGetUserByIdQuery(user?.uid, {
 skip: !user?.uid
 });
 const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
 
 const [formData, setFormData] = useState({
 displayName: '',
 phone: '',
 role: 'renter',
 bio: ''
 });

 useEffect(() => {
 if (profileData?.data) {
 setFormData({
 displayName: profileData.data.displayName || '',
 phone: profileData.data.phone || '',
 role: profileData.data.role || 'renter',
 bio: profileData.data.bio || ''
 });
 }
 }, [profileData]);

 const handleUpdate = async (e) => {
 e.preventDefault();
 try {
 await updateUser({
 id: user.uid,
 ...formData
 }).unwrap();
 
 dispatch(showModal({
   type: 'success',
   title: 'Identity Synchronized',
   message: 'Your profile settings have been successfully updated across the collective.',
   actionText: 'View Dashboard',
   redirect: '/dashboard'
 }));
 } catch (err) {
 console.error('Update failed:', err);
 dispatch(showModal({
   type: 'error',
   title: 'Sync Failed',
   message: err?.data?.error || 'We could not update your profile. Please check your connection.',
   actionText: 'Retry'
 }));
 }
 };

 if (isProfileLoading) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
 <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
 <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Syncing Identity...</p>
 </div>
 );
 }

 return (
 <div className="max-w-4xl space-y-12 pb-20">
 {/* Header */}
 <div className="space-y-6">
 <div className="inline-flex items-center space-x-3 bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full">
 <Sparkles className="w-4 h-4 text-primary-light" />
 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-light">Security & Identity</span>
 </div>
 <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter uppercase ">
 Profile <br />
 <span className="text-gradient-gold">Configuration.</span>
 </h1>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
 {/* Left: Avatar & Role Summary */}
 <div className="lg:col-span-1 space-y-8">
 <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
 <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
 
 <div className="relative">
 <div className="w-32 h-32 bg-primary/20 rounded-[2.5rem] flex items-center justify-center border border-primary/20 relative">
 <UserIcon className="w-12 h-12 text-primary-light" />
 <button className="absolute -bottom-2 -right-2 p-3 bg-white text-black rounded-2xl shadow-xl hover:scale-110 transition-transform">
 <Camera className="w-4 h-4" />
 </button>
 </div>
 </div>

 <div className="space-y-2 relative z-10">
 <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{formData.displayName || 'Unnamed Estate'}</h3>
 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{user?.email}</p>
 </div>

 <div className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest relative z-10 ${
 formData.role === 'landlord' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
 }`}>
 {formData.role === 'landlord' ? 'Elite Landlord' : 'Verified Renter'}
 </div>
 </div>

 <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-4">
 <div className="flex items-center space-x-3 text-secondary text-[10px] font-black uppercase tracking-widest">
 <AlertCircle className="w-4 h-4" />
 <span>Account Note</span>
 </div>
 <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
 Roles define your interaction strategy. Landlords can list properties, while Renters gain priority audit access.
 </p>
 </div>
 </div>

 {/* Right: Detailed Settings */}
 <form onSubmit={handleUpdate} className="lg:col-span-2 space-y-8">
 <div className="bg-white/5 border border-white/5 rounded-[3.5rem] p-10 md:p-14 space-y-10">
 
 {/* Field: Role Switcher */}
 <div className="space-y-6">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Strategic Persona</label>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {[
 { id: 'renter', label: 'Renter / Buyer', icon: UserCheck, desc: 'Find and audit estates.' },
 { id: 'landlord', label: 'Landlord / Agent', icon: Building2, desc: 'List and manage assets.' }
 ].map((role) => (
 <button
 key={role.id}
 type="button"
 onClick={() => setFormData({...formData, role: role.id})}
 className={`flex items-center space-x-4 p-6 rounded-[2rem] border transition-all text-left ${
 formData.role === role.id 
 ? 'bg-primary/10 border-primary text-white shadow-xl shadow-primary/10' 
 : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
 }`}
 >
 <div className={`p-3 rounded-xl ${formData.role === role.id ? 'bg-primary text-white' : 'bg-white/10 text-gray-500'}`}>
 <role.icon className="w-5 h-5" />
 </div>
 <div>
 <p className="text-xs font-black uppercase tracking-widest">{role.label}</p>
 <p className="text-[9px] font-medium opacity-50">{role.desc}</p>
 </div>
 </button>
 ))}
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Full Identity</label>
 <div className="relative">
 <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-light" />
 <input 
 type="text" 
 value={formData.displayName}
 onChange={(e) => setFormData({...formData, displayName: e.target.value})}
 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-primary/50 transition-all text-sm"
 placeholder="Your Legal Name"
 />
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Direct Contact</label>
 <div className="relative">
 <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-light" />
 <input 
 type="tel" 
 value={formData.phone}
 onChange={(e) => setFormData({...formData, phone: e.target.value})}
 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white font-bold focus:outline-none focus:border-primary/50 transition-all text-sm"
 placeholder="+237 ..."
 />
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Professional Bio</label>
 <textarea 
 value={formData.bio}
 onChange={(e) => setFormData({...formData, bio: e.target.value})}
 className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-white font-medium text-sm focus:outline-none focus:border-primary/50 min-h-[120px] resize-none"
 placeholder="Brief summary of your real estate goals..."
 />
 </div>
 </div>

 <div className="flex items-center justify-between px-4">
 <div />

 <button 
 type="submit"
 disabled={isUpdating}
 className="bg-white text-black px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all hover:scale-105 emerald-glow-light flex items-center space-x-3"
 >
 {isUpdating ? 'Synchronizing...' : (
 <>
 <Save className="w-4 h-4" />
 <span>Update Profile</span>
 </>
 )}
 </button>
 </div>
 </form>
 </div>
 </div>
 );
}
