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
        <div>
            <input 
                type="file"
                onChange={handleFileSelect}
                multiple
                accept=".pdf,.xlsx,.xls"
                className="hidden"
                id="file-upload"
            />
        </div>
    )
}