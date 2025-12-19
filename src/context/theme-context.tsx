
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
    borderWidth: number;
    borderColor: string;
    setBorderWidth: (width: number) => void;
    setBorderColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [borderWidth, setBorderWidth] = useState(3);
    const [borderColor, setBorderColor] = useState('#D8E0E3');

    return (
        <ThemeContext.Provider value={{ borderWidth, borderColor, setBorderWidth, setBorderColor }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
