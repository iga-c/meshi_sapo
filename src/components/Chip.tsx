import React from 'react';
import { X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ChipProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    onDelete?: () => void;
    isDeleteMode?: boolean;
}

export const Chip: React.FC<ChipProps> = ({ label, isActive, onClick, onDelete, isDeleteMode = false }) => {
    return (
        <div className="relative group">
            <button
                onClick={onClick}
                className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105",
                    "shadow-sm hover:shadow-md",
                    isActive
                        ? "bg-gentle-orange text-white shadow-gentle-orange/50"
                        : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
                )}
            >
                {label}
            </button>

            {isDeleteMode && onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full p-1 shadow-sm hover:bg-red-500 transition-colors animate-in fade-in zoom-in duration-200"
                    title="削除"
                >
                    <X size={12} />
                </button>
            )}
        </div>
    );
};
