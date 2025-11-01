import React from 'react';
import CheckIcon from './icons/CheckIcon';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
    "Welcome",
    "Select Model",
    "Select Technique",
    "Configure",
    "Results"
];

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-center">
        {steps.map((stepName, index) => {
          const stepIndex = index + 1;
          const isCompleted = currentStep > stepIndex;
          const isCurrent = currentStep === stepIndex;

          return (
            <li key={stepName} className={`relative ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
              {isCompleted ? (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-sky-600" />
                  </div>
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 hover:bg-sky-900">
                    <CheckIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="absolute -bottom-7 text-xs text-center w-full whitespace-nowrap text-slate-300">{stepName}</span>
                </>
              ) : isCurrent ? (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-gray-700" />
                  </div>
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-sky-600 bg-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-600" aria-hidden="true" />
                  </div>
                  <span className="absolute -bottom-7 text-xs text-center w-full whitespace-nowrap font-semibold text-sky-400">{stepName}</span>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="h-0.5 w-full bg-gray-700" />
                  </div>
                  <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-600 bg-slate-800 hover:border-gray-500">
                     <span className="h-2.5 w-2.5 rounded-full bg-transparent " aria-hidden="true" />
                  </div>
                   <span className="absolute -bottom-7 text-xs text-center w-full whitespace-nowrap text-slate-500">{stepName}</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepIndicator;