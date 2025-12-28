
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = "flex items-center justify-center gap-3 rounded-2xl h-14 px-8 font-bold transition-all duration-300 active:scale-[0.96] overflow-hidden relative group";

  const variants = {
    primary: "bg-gradient-to-r from-[#137fec] to-[#0d5bb5] text-white shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5",
    secondary: "bg-white/10 dark:bg-white/5 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl shadow-red-500/20 hover:shadow-red-500/30",
    ghost: "bg-transparent text-primary hover:bg-primary/10"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div
    className={`bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/50 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const Icon: React.FC<{ name: string, className?: string, filled?: boolean }> = ({ name, className = '', filled = false }) => (
  <span className={`material-symbols-outlined ${filled ? 'icon-filled' : ''} ${className}`} style={filled ? { fontVariationSettings: "'FILL' 1" } : {}}>
    {name}
  </span>
);
