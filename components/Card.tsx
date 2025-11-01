import React from 'react';

interface CardProps {
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  // Fix: Specify that the icon prop is a React element that can accept a className.
  // This resolves the TypeScript error with React.cloneElement.
  icon: React.ReactElement<{ className?: string }>;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, isSelected, onClick, icon, children }) => {
  // Increased opacity for both selected and unselected states
  const baseClasses = "p-6 border rounded-lg cursor-pointer transition-all duration-200 text-center";
  const selectedClasses = "border-sky-500 bg-sky-500/70 ring-2 ring-sky-500";
  const unselectedClasses = "border-slate-700 bg-slate-900/80 hover:border-slate-500 hover:bg-slate-900/95 hover:shadow-lg";

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${isSelected ? 'bg-sky-900' : 'bg-slate-700'}`}>
        {React.cloneElement(icon, { className: `h-6 w-6 ${isSelected ? 'text-sky-400' : 'text-slate-300'}` })}
      </div>
      {/* Increased font size and weight for title and description */}
      <h3 className="mt-4 text-2xl font-bold text-slate-100">{title}</h3>
      <p className="mt-1 text-lg font-semibold text-slate-300">{description}</p>
      {children}
    </div>
  );
};

export default Card;