
import React from 'react';

interface BitOption {
  value: string | number;
  label: string;
}

interface BitPrecisionSelectorProps {
  options: BitOption[];
  value: string | number;
  onChange: (value: string | number) => void;
}

const BitPrecisionSelector: React.FC<BitPrecisionSelectorProps> = ({ options, value, onChange }) => {
  return (
    // This is the "health bar" container. It has a dark, semi-transparent background and a border, resembling a console slot.
    <div className="flex justify-between items-stretch gap-3 p-2 rounded-lg bg-slate-900/50 border border-slate-700 shadow-inner">
      {/* We map over the bit precision options (e.g., 16, 8, 4) to create selectable "cells". */}
      {options.map((option) => {
        const isSelected = value == option.value;
        // The label "16-bit Float" is split to display "Float" below the number "16".
        const labelParts = option.label.split(' ');
        const typeLabel = labelParts.slice(1).join(' '); // Handles labels like "8-bit Integer"

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            // The button styling changes dramatically when selected, giving it a bright, glowing effect.
            // Unselected buttons are more subdued but have a hover effect.
            className={`flex-1 text-center p-3 rounded-md transition-all duration-300 transform focus:outline-none focus:ring-2 ring-offset-2 ring-offset-slate-900 ${
              isSelected
                ? 'bg-sky-500 text-white shadow-[0_0_15px_theme(colors.sky.500),inset_0_0_5px_theme(colors.sky.300)] ring-sky-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {/* The bit number is large and bold for emphasis. */}
            <span className="block text-3xl sm:text-4xl font-bold">{option.value}</span>
            {/* The type (Float/Integer) is smaller and acts as a sub-label. */}
            <span className="block text-xs uppercase tracking-wider text-slate-400">{typeLabel}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BitPrecisionSelector;
