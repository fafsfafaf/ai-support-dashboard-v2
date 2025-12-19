
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
    borderWidth: number;
    borderColor: string;
    dividerColor: string;
    primaryColor: string;
    setBorderWidth: (width: number) => void;
    setBorderColor: (color: string) => void;
    setDividerColor: (color: string) => void;
    setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [borderWidth, setBorderWidth] = useState(1);
    const [borderColor, setBorderColor] = useState('#dbdbdb');
    const [dividerColor, setDividerColor] = useState('#dbdbdb');
    const [primaryColor, setPrimaryColor] = useState('#6024B9');

    return (
        <ThemeContext.Provider value={{
            borderWidth, borderColor, dividerColor, primaryColor,
            setBorderWidth, setBorderColor, setDividerColor, setPrimaryColor
        }}>
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
