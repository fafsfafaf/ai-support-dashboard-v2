
import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderViewProps {
    title: string;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title }) => {
    return (
        <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50/50 rounded-3xl border border-gray-200/60 m-2">
            <div className="text-center">
                <Construction className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="max-w-md mx-auto">This page is currently under construction in the new Next.js version.</p>
            </div>
        </div>
    );
};
