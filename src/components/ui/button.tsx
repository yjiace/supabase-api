import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'cyber' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    default: 'bg-neon-green text-dark-bg hover:bg-neon-green/90 hover:shadow-lg hover:scale-105',
    cyber: 'bg-gradient-to-r from-neon-green to-neon-blue text-dark-bg hover:shadow-lg hover:scale-105 neon-glow',
    outline: 'border border-neon-green text-neon-green hover:bg-neon-green hover:text-dark-bg hover:neon-glow',
    ghost: 'text-cyber-light hover:bg-dark-surface hover:text-neon-green'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}