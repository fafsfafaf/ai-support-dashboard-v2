
import React, { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

export const Badge = ({ children, color = 'gray', className = '' }: { children?: React.ReactNode, color?: 'gray' | 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'orange', className?: string }) => {
    const colors = {
        gray: 'bg-gray-100 text-gray-600',
        green: 'bg-emerald-50 text-emerald-600',
        blue: 'bg-blue-100 text-blue-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        red: 'bg-red-50 text-red-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600'
    };
    return (
        <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border border-transparent ${colors[color]} ${className}`}>
            {children}
        </span>
    );
};

export const Avatar = ({ src, fallback, size = 'md', className = '' }: { src?: string; fallback: React.ReactNode, size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) => {
    const sizes = { sm: 'h-6 w-6 text-[10px]', md: 'h-8 w-8 text-xs', lg: 'h-10 w-10 text-sm', xl: 'h-16 w-16 text-xl' };
    return (
        <div className={`${sizes[size]} rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border border-gray-100 text-indigo-700 font-bold shrink-0 ${className}`}>
            {src ? <img src={src} alt="avatar" className="h-full w-full object-cover" /> : fallback}
        </div>
    );
};

export const Resizer = ({ className, onResize }: { className?: string, onResize: (delta: number) => void }) => {
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                e.preventDefault();
                onResize(e.movementX);
            }
        };
        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, onResize]);

    return (
        <div
            className={`absolute top-0 bottom-0 w-4 flex items-center justify-center cursor-col-resize z-50 group ${className}`}
            onMouseDown={() => setIsDragging(true)}
        >
            <div className={`w-px h-full transition-colors duration-200 ${isDragging ? 'bg-blue-600' : 'bg-transparent group-hover:bg-blue-200'}`}></div>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center transition-all duration-200 ${isDragging ? 'opacity-100 scale-100 border-blue-400' : 'opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'}`}>
                <GripVertical className={`w-2.5 h-2.5 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
        </div>
    );
};
