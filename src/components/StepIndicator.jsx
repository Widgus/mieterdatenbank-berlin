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
    <div className="w-full bg-parchment border-b border-parchment-3">
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
                        ? 'bg-success text-white'
                        : isActive
                        ? 'bg-primary text-white'
                        : 'bg-parchment-3 text-ink-3'
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : step}
                  </div>
                  <span
                    className={`text-sm font-semibold font-headline tracking-headline ${
                      isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-ink-3'
                    }`}
                  >
                    {label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step ? 'bg-success' : 'bg-parchment-3'
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
