'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function StepIndicator({ currentStep, totalSteps, steps }) {
 return (
 <div className="flex items-center justify-between relative mb-12">
 <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2" />
 
 {steps.map((step, i) => {
 const stepNumber = i + 1;
 const isCompleted = currentStep > stepNumber;
 const isActive = currentStep === stepNumber;

 return (
 <div key={i} className="relative z-10 flex flex-col items-center group">
 <motion.div
 animate={{
 scale: isActive ? 1.2 : 1,
 backgroundColor: isCompleted ? '#00cf82' : isActive ? '#fff' : '#0c0c0e',
 borderColor: isCompleted || isActive ? 'transparent' : 'rgba(255,255,255,0.1)'
 }}
 className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500`}
 >
 {isCompleted ? (
 <Check className="w-5 h-5 text-black font-black" />
 ) : (
 <span className={`text-xs font-black ${isActive ? 'text-black' : 'text-gray-500'}`}>
 0{stepNumber}
 </span>
 )}
 </motion.div>
 
 <div className="absolute top-14 whitespace-nowrap text-center">
 <p className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? 'text-white' : 'text-gray-600'}`}>
 {step}
 </p>
 </div>
 </div>
 );
 })}
 </div>
 );
}
