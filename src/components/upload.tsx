"use client";

import { useState } from "react"

interface UploadComponentProps {
    onUpload: (files: File[]) => void;
} 

export function UploadComponent({ onUpload }: UploadComponentProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files || []);
        onUpload(selectedFiles);
    }

    return (
        <div className="text-center">
            <input 
                type="file"
                onChange={handleFileSelect}
                multiple
                accept=".pdf,.xlsx,.xls"
                className="hidden"
                id="file-upload"
            />
            <label 
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg cursor-pointer transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Select Files
            </label>
            <p className="mt-2 text-sm text-gray-500">
                PDF, Excel files are allowed
            </p>
        </div>
    )
}