'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export function StepIndicator({ currentStep, totalSteps, steps }) {
  return (
    <div className="flex items-start overflow-x-auto pb-4 gap-0 no-scrollbar -mx-1 px-1">
      {steps.map((step, i) => {
        const stepNumber = i + 1;
        const isCompleted = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;
        const isNearby = Math.abs(currentStep - stepNumber) <= 1;

        return (
          <div key={i} className="flex items-start min-w-0">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                className={`w-7 h-7 md:w-9 md:h-9 rounded-full border-2 flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                  isCompleted || isActive
                    ? 'bg-primary border-primary'
                    : 'bg-white border-gray-200'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                ) : (
                  <span
                    className={`text-[10px] md:text-xs font-bold ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {stepNumber}
                  </span>
                )}
              </motion.div>
              <span
                className={`text-center transition-colors leading-tight ${
                  isActive || isCompleted ? 'text-primary' : 'text-gray-400'
                } ${isNearby ? 'block' : 'hidden md:block'} text-[7px] md:text-[9px] font-bold uppercase tracking-wider max-w-[60px] md:max-w-none`}
              >
                {step}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div className="w-4 md:w-8 h-px mt-3.5 md:mt-4 mx-0.5 md:mx-1.5 flex-shrink-0">
                <div
                  className={`h-full transition-all duration-500 ${
                    isCompleted ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
