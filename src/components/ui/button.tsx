
import React from 'react';
import { cn } from '@/lib/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
                    {
                        'bg-[hsl(264,67%,43%)] text-white hover:bg-[hsl(264,67%,38%)]': variant === 'primary',
                        'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50': variant === 'secondary',
                        'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm': variant === 'outline',
                        'hover:bg-gray-100 text-gray-600': variant === 'ghost',
                        'bg-red-50 text-red-600 hover:bg-red-100': variant === 'danger',
                        'h-8 px-3 text-xs': size === 'sm',
                        'h-10 px-4 py-2': size === 'md',
                        'h-12 px-6': size === 'lg',
                        'h-10 w-10 p-0': size === 'icon',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
