import React from 'react';

interface WelcomeStepProps {
  onDive: () => void;
  animationState: 'none' | 'diving' | 'exploding' | 'compressing' | 'imploding';
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onDive, animationState }) => {
  const isAnimating = animationState !== 'none';
  return (
    <div className="flex flex-col items-center justify-end h-full text-center pb-24">
      <button
        onClick={onDive}
        disabled={isAnimating}
        className={`px-10 py-5 sm:px-16 sm:py-6 text-white text-4xl sm:text-5xl font-bold rounded-lg hover:text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/75 transition-all duration-1000 ease-in-out font-gruppo tracking-[0.3em] uppercase ${isAnimating ? 'opacity-0 scale-150' : 'opacity-100 transform hover:scale-110'}`}
      >
        DIVE IN
      </button>
    </div>
  );
};

export default WelcomeStep;