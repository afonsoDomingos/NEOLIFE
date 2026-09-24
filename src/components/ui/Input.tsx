import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs min-h-[36px]',
    md: 'px-4 py-3 text-sm min-h-[44px]',
    lg: 'px-4 py-3 text-base min-h-[48px]',
  };

  const labelSizeClasses = {
    sm: 'text-xs mb-1',
    md: 'text-sm mb-2',
    lg: 'text-sm mb-2',
  };

  return (
    <div className="w-full">
      {label && (
        <label className={`block font-medium text-gray-700 ${labelSizeClasses[size]}`}>
          {label}
        </label>
      )}
      <input
        className={`w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 ${sizeClasses[size]} ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className={`mt-1 text-red-600 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>{error}</p>
      )}
    </div>
  );
};

export const Select: React.FC<{
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  label,
  error,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white min-h-[48px] ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export const Textarea: React.FC<{
  label?: string;
  error?: string;
  className?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 resize-none min-h-[120px] ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};