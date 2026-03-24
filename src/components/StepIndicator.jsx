import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { label: 'Wohnung', step: 1 },
  { label: 'Anforderungen', step: 2 },
  { label: 'Ergebnisse', step: 3 },
  { label: 'Einladung', step: 4 },
];

export default function StepIndicator({ currentStep, onStepClick }) {
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {STEPS.map(({ label, step }, i) => {
            const isCompleted = currentStep > step;
            const isActive = currentStep === step;
            const isClickable = isCompleted;

            return (
              <React.Fragment key={step}>
                <button
                  onClick={() => isClickable && onStepClick(step)}
                  disabled={!isClickable}
                  className={`flex items-center gap-2 ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : step}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isActive ? 'text-primary-700' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
