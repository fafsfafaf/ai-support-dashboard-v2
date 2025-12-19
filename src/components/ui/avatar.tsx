
import React from 'react';
import { cn } from '@/lib/cn';

interface AvatarProps {
    src?: string;
    fallback: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, fallback, size = 'md', className }) => {
    return (
        <div className={cn(
            "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-100",
            {
                'h-8 w-8 text-xs': size === 'sm',
                'h-10 w-10 text-sm': size === 'md',
                'h-12 w-12 text-base': size === 'lg',
            },
            className
        )}>
            {src ? (
                <img src={src} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
                <span className="font-medium text-gray-600">{fallback}</span>
            )}
        </div>
    );
};
