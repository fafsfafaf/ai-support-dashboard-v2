
import React from 'react';
import { cn } from '@/lib/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    {
                        'border-transparent bg-primary/10 text-primary hover:bg-primary/20': variant === 'default',
                        'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200/80': variant === 'secondary',
                        'text-gray-900 border-gray-200': variant === 'outline',
                        'border-transparent bg-red-100 text-red-700 hover:bg-red-200': variant === 'destructive',
                        'border-transparent bg-green-100 text-green-700 hover:bg-green-200': variant === 'success',
                        'border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200': variant === 'warning',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Badge.displayName = "Badge";
