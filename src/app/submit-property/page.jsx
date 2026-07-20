'use client';
import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Zap,
  MapPin,
  Maximize,
  DollarSign,
  Home,
  CheckCircle2,
  X,
  Upload,
  UserCircle,
  Briefcase,
  Trees,
  Utensils,
  Car,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import Image from 'next/image';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { showModal } from '@/store/slices/uiSlice';
import { useGetUserByIdQuery } from '@/store/services/userApi';
import { useCreatePropertyMutation } from '@/store/services/propertyApi';
import { StepIndicator } from '@/components/properties/submission/StepIndicator';
import { AmenitySelector } from '@/components/properties/submission/AmenitySelector';
import { AccountUpgradeRequired } from '@/components/shared/AccountUpgradeRequired';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const LocationMap = dynamic(
  () => import('@/components/properties/submission/LocationMap'),
  { ssr: false }
);

const STEPS = [
  'Type & Title',
  'Valuation & Details',
  'Specifications',
  'Photos',
  'Location',
  'Review',
];

export default function SubmitPropertyPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const { data: profileData, isLoading: isProfileLoading } = useGetUserByIdQuery(user?.uid, {
    skip: !user?.uid,
  });
  const [createProperty, { isLoading: isSubmitting }] = useCreatePropertyMutation();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: 'for-rent',
    property_type: 'apartment',
    price: '',
    price_negotiable: false,
    description: '',
    city: 'Douala',
    quarter: '',
    address: '',
    lat: '',
    lng: '',
    bedrooms: '2',
    bathrooms: '2',
    area_sqm: '120',
    furnished: false,
    parking: false,
    amenities: [],
    images: [],
    imageFiles: [],
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [stepError, setStepError] = useState('');
  const fileInputRef = useRef(null);

  const handleNext = () => {
    setStepError('');
    if (step === 1) {
      if (!formData.title.trim() || formData.title.trim().length < 12) {
        setStepError('Property title must be at least 12 characters.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.price || Number(formData.price) <= 0) {
        setStepError('Please enter a valid price greater than 0.');
        return;
      }
      if (!formData.description.trim() || formData.description.trim().length < 20) {
        setStepError('Please add a description (at least 20 characters).');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const handlePrev = () => {
    setStepError('');
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleImageUpload = (e) => {
    const files = e?.target?.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const readFiles = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          resolve({ file, preview: ev.target.result });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readFiles).then((results) => {
      setFormData((prev) => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...results.map((r) => r.file)],
        images: [...prev.images, ...results.map((r) => r.preview)],
      }));
    });
  };

  const triggerFileSelect = () => fileInputRef.current?.click();
  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
      imageFiles: prev.imageFiles.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async () => {
    if (formData.images.length === 0) {
      setStep(4);
      setStepError('Please upload at least one image before publishing.');
      return;
    }
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        property_type: formData.property_type,
        category: formData.category,
        price: Number(formData.price),
        price_negotiable: formData.price_negotiable,
        location: {
          city: formData.city,
          quarter: formData.quarter,
          address: formData.address,
          coordinates:
            formData.lat && formData.lng
              ? { lat: Number(formData.lat), lng: Number(formData.lng) }
              : null,
        },
        specifications: {
          bedrooms: Number(formData.bedrooms) || 0,
          bathrooms: Number(formData.bathrooms) || 0,
          area_sqm: Number(formData.area_sqm) || 0,
          furnished: Boolean(formData.furnished),
          parking: Boolean(formData.parking),
        },
        advantages: formData.amenities,
        images: [],
        landlord_id: user.uid,
        status: 'verified',
      };

      await createProperty(payload).unwrap();
      dispatch(
        showModal({
          type: 'success',
          title: 'Listing Published',
          message: `Your property "${formData.title}" has been successfully listed.`,
          actionText: 'View Inventory',
          redirect: '/dashboard/properties',
        })
      );
      setIsSuccess(true);
    } catch (err) {
      dispatch(
        showModal({
          type: 'error',
          title: 'Publication Failed',
          message: err?.data?.error || 'We encountered an error. Please try again.',
          actionText: 'Retry',
        })
      );
    }
  };

  if (isProfileLoading) return null;

  const isLandlord = profileData?.data?.role === 'landlord';

  if (!isLandlord) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <AccountUpgradeRequired message="Only registered Elite Landlords can list properties." />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full bg-white border border-gray-200 rounded-2xl p-8 md:p-12 text-center space-y-8 shadow-sm"
        >
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Listing Published</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your property &quot;{formData.title}&quot; has been verified and listed on the marketplace.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard/properties"
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-xs tracking-wider transition-all hover:bg-primary-dark"
            >
              Go to Inventory
            </Link>
            <button
              onClick={() => {
                setIsSuccess(false);
                setStep(1);
                setFormData({ ...formData, title: '', images: [], imageFiles: [] });
              }}
              className="w-full bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold text-xs tracking-wider border border-gray-200 hover:bg-gray-200 transition-all"
            >
              List Another Property
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-20">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => {
                  if (window.confirm('Discard this draft?')) router.back();
                }}
                className="p-1.5 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-all text-gray-500 hover:text-gray-700 flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <h1 className="text-sm md:text-base font-bold text-gray-900 truncate">
                  List New Property
                </h1>
                <p className="text-[10px] text-gray-500 font-medium">
                  Step {step} of {STEPS.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-lg">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
                Draft
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-20 mt-6 md:mt-8">
        <StepIndicator currentStep={step} totalSteps={STEPS.length} steps={STEPS} />

        <div className="mt-8 md:mt-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Category */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase ml-1">
                    Listing Type
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {['for-rent', 'for-sale', 'short-stay'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`flex-1 min-w-[100px] py-3.5 rounded-xl border font-bold text-[10px] uppercase tracking-wider transition-all ${
                          formData.category === cat
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {cat.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase ml-1">
                    Property Type
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {[
                      { id: 'apartment', icon: Building2 },
                      { id: 'house', icon: Home },
                      { id: 'studio', icon: UserCircle },
                      { id: 'villa', icon: Home },
                      { id: 'commercial', icon: Briefcase },
                      { id: 'land', icon: Trees },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setFormData({ ...formData, property_type: t.id })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                          formData.property_type === t.id
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <t.icon className={`w-5 h-5 ${formData.property_type === t.id ? 'text-primary' : 'text-gray-400'}`} />
                        <span className="text-[9px] font-bold uppercase tracking-wider">{t.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase ml-1">
                    Property Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-base font-bold text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-gray-400"
                    placeholder="e.g. Ultra-Modern Penthouse in Bonapriso"
                  />
                  <p className="text-[9px] text-gray-400 font-medium ml-1">
                    Min. 12 characters required
                  </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Price */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase ml-1">
                      Market Price (XAF)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-lg font-bold text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-gray-400"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Negotiable toggle */}
                  <div className="flex items-end pb-3.5">
                    <label className="flex items-center gap-3 cursor-pointer group bg-white border border-gray-200 p-4 rounded-xl hover:bg-gray-50 transition-all w-full">
                      <div
                        className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                          formData.price_negotiable ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                            formData.price_negotiable ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-700">Price Negotiable</span>
                      <input
                        type="checkbox"
                        checked={formData.price_negotiable}
                        onChange={(e) =>
                          setFormData({ ...formData, price_negotiable: e.target.checked })
                        }
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase ml-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-xl p-5 text-sm text-gray-700 min-h-[180px] resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-gray-400"
                    placeholder="Describe the property's features, location advantages, and unique selling points..."
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Specs grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['apartment', 'house', 'villa'].includes(formData.property_type) && (
                    <>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase ml-1">
                          Bedrooms
                        </label>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              onClick={() => setFormData({ ...formData, bedrooms: val })}
                              className={`flex-1 py-3 rounded-lg border text-[10px] font-bold transition-all ${
                                Number(formData.bedrooms) === val
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase ml-1">
                          Bathrooms
                        </label>
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              onClick={() => setFormData({ ...formData, bathrooms: val })}
                              className={`flex-1 py-3 rounded-lg border text-[10px] font-bold transition-all ${
                                Number(formData.bathrooms) === val
                                  ? 'bg-primary text-white border-primary'
                                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase ml-1">
                      Area (m&sup2;)
                    </label>
                    <div className="relative">
                      <Maximize className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      <input
                        type="number"
                        value={formData.area_sqm}
                        onChange={(e) => setFormData({ ...formData, area_sqm: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-lg py-3 pl-9 pr-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
                  <label className="flex items-center justify-between gap-3 cursor-pointer bg-white border border-gray-200 p-4 rounded-xl hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-3">
                      <Utensils className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-bold text-gray-700">Furnished</span>
                    </div>
                    <div
                      className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                        formData.furnished ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                          formData.furnished ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.furnished}
                      onChange={(e) =>
                        setFormData({ ...formData, furnished: e.target.checked })
                      }
                      className="hidden"
                    />
                  </label>

                  <label className="flex items-center justify-between gap-3 cursor-pointer bg-white border border-gray-200 p-4 rounded-xl hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-3">
                      <Car className="w-4 h-4 text-gray-400" />
                      <span className="text-xs font-bold text-gray-700">Parking</span>
                    </div>
                    <div
                      className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${
                        formData.parking ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                          formData.parking ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.parking}
                      onChange={(e) =>
                        setFormData({ ...formData, parking: e.target.checked })
                      }
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Amenities */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase ml-1">
                    Amenities
                  </label>
                  <AmenitySelector
                    selected={formData.amenities}
                    onChange={(val) => setFormData({ ...formData, amenities: val })}
                  />
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase ml-1">
                  Property Media
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {/* Upload trigger */}
                  <div
                    onClick={triggerFileSelect}
                    className="aspect-video bg-gray-100 border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2">
                      <Upload className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                      Upload
                    </p>
                    <p className="text-[8px] text-gray-400 font-medium mt-1">Max 5MB</p>
                  </div>

                  {/* Previews */}
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-video relative rounded-xl overflow-hidden group border border-gray-200 bg-white"
                    >
                      <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`Preview ${idx}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      </div>
                      <div className="absolute inset-0 bg-black/30 md:bg-black/0 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(idx);
                          }}
                          className="w-8 h-8 md:w-9 md:h-9 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase ml-1">
                      City
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all cursor-pointer"
                    >
                      {['Douala', 'Yaoundé', 'Kribi', 'Limbe'].map((c) => (
                        <option key={c} value={c} className="bg-white text-gray-900">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase ml-1">
                      Quarter / Neighborhood
                    </label>
                    <input
                      type="text"
                      value={formData.quarter}
                      onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-gray-400"
                      placeholder="e.g. Bonapriso"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase ml-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all placeholder:text-gray-400"
                      placeholder="e.g. Rue des Ecoles"
                    />
                  </div>


                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-2 min-h-[350px] md:min-h-[450px]">
                  <LocationMap
                    position={{ lat: formData.lat, lng: formData.lng }}
                    onPositionChange={(pos) =>
                      setFormData({
                        ...formData,
                        lat: pos.lat.toFixed(6),
                        lng: pos.lng.toFixed(6),
                      })
                    }
                  />
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 flex-shrink-0">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold tracking-wider uppercase text-primary">
                          Review Summary
                        </p>
                        <h4 className="text-lg font-bold text-gray-900">Ready for Listing</h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                          Valuation
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {Number(formData.price).toLocaleString()} XAF
                        </p>
                        {formData.price_negotiable && (
                          <span className="text-[9px] text-primary uppercase tracking-wider font-bold mt-1 block">
                            Negotiable
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                          Location
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {formData.quarter || 'N/A'}, {formData.city}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <h5 className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                        Property Details
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Type', value: formData.property_type },
                          { label: 'Category', value: formData.category.replace('-', ' ') },
                          { label: 'Bedrooms', value: formData.bedrooms },
                          { label: 'Bathrooms', value: formData.bathrooms },
                          { label: 'Area', value: `${formData.area_sqm} m²` },
                          { label: 'Furnished', value: formData.furnished ? 'Yes' : 'No' },
                          { label: 'Parking', value: formData.parking ? 'Yes' : 'No' },
                          { label: 'Images', value: `${formData.images.length} uploaded` },
                        ].map((d, i) => (
                          <div key={i} className="bg-gray-50 rounded-lg p-3">
                            <p className="text-[8px] font-bold uppercase tracking-wider text-gray-400">
                              {d.label}
                            </p>
                            <p className="text-sm font-bold text-gray-900 mt-0.5 capitalize">
                              {d.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {formData.amenities.length > 0 && (
                      <div className="pt-6 border-t border-gray-100">
                        <h5 className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                          Amenities
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {formData.amenities.map((a) => (
                            <span
                              key={a}
                              className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-md capitalize"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <Zap className="w-8 h-8 text-primary" />
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-gray-900">Publish Property</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Your property will be evaluated and deployed across our marketplace network.
                      </p>
                    </div>
                  </div>
                  <button
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-xs tracking-wider transition-all"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Now'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error */}
        {stepError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{stepError}</span>
          </motion.div>
        )}

        {/* Navigation */}
        {!isSuccess && (
          <div className="mt-8 md:mt-10 flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                step === 1
                  ? 'opacity-0 pointer-events-none'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {step < STEPS.length ? (
              <button
                onClick={handleNext}
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
