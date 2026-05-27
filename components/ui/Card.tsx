import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'solid';
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, variant = 'default' }) => {
  const baseStyles = "relative overflow-hidden rounded-[2rem] transition-all duration-500";
  
  const variants = {
    default: "bg-charcoal/80 backdrop-blur-2xl border border-white/5 shadow-2xl",
    glass: "bg-glass-medium backdrop-blur-3xl border border-white/10 shadow-glass-edge",
    solid: "bg-zinc-900 border border-zinc-800"
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        baseStyles,
        variants[variant],
        onClick && "cursor-pointer active:scale-[0.98] hover:border-white/10",
        className
      )}
    >
      {/* Subtle sheen effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};