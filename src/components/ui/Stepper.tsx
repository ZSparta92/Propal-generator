'use client';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, idx) => (
        <div key={idx} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              idx < currentStep ? 'bg-blue-600 text-white' : idx === currentStep ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-200 text-gray-500'
            }`}>
              {idx < currentStep ? '✓' : idx + 1}
            </div>
            <span className={`text-xs mt-1 ${idx <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{step}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-8 h-0.5 mx-1 ${idx < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
