
"use client";

import React from 'react';
import { useTheme } from '@/context/theme-context';
import { Settings2, X } from 'lucide-react';

export const ThemeCustomizer = () => {
    const { borderWidth, borderColor, setBorderWidth, setBorderColor } = useTheme();
    const [isOpen, setIsOpen] = React.useState(true);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-full shadow-lg z-50 hover:bg-gray-800 transition"
            >
                <Settings2 className="h-6 w-6" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 bg-white p-6 rounded-2xl shadow-2xl border border-gray-200 z-50 w-80 animate-in slide-in-from-bottom-4 fade-in duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Settings2 className="h-4 w-4" />
                    Design Anpasser
                </h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="space-y-4">
                {/* Border Width Config */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <label className="font-medium text-gray-700">Rahmen Dicke</label>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono">
                            {borderWidth}px
                        </span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="20"
                        step="1"
                        value={borderWidth}
                        onChange={(e) => setBorderWidth(Number(e.target.value))}
                        className="w-full accent-[#6024B9]"
                    />
                </div>

                {/* Border Color Config */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <label className="font-medium text-gray-700">Rahmen Farbe</label>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono uppercase">
                            {borderColor}
                        </span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            value={borderColor}
                            onChange={(e) => setBorderColor(e.target.value)}
                            className="h-10 w-10 p-1 rounded cursor-pointer border border-gray-200"
                        />
                        <input
                            type="text"
                            value={borderColor}
                            onChange={(e) => setBorderColor(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#6024B9]/20 focus:border-[#6024B9]"
                        />
                    </div>
                </div>

                {/* Divider Color Config */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <label className="font-medium text-gray-700">Trennlinien Farbe</label>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono uppercase">
                            {useTheme().dividerColor}
                        </span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            value={useTheme().dividerColor}
                            onChange={(e) => useTheme().setDividerColor(e.target.value)}
                            className="h-10 w-10 p-1 rounded cursor-pointer border border-gray-200"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <strong>Aktuelle Werte:</strong><br />
                        border-width: {borderWidth}px;<br />
                        border-color: {borderColor};
                    </div>
                </div>
            </div>
        </div>
    );
};
