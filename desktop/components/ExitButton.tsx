'use client';

import React from 'react';
import { X } from 'lucide-react';

export function ExitButton() {
    const handleExit = () => {
        if (typeof window !== 'undefined' && window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('close-app');
        } else {
            console.warn('Electron ipcRenderer not found');
        }
    };

    return (
        <button
            onClick={handleExit}
            className="fixed top-4 right-4 z-50 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
            aria-label="Exit App"
        >
            <X size={24} />
        </button>
    );
}
