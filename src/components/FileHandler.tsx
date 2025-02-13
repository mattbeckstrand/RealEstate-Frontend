// src/components/FileHandler.tsx
"use client"

import { useState } from "react"
import { UploadComponent } from '@/components/upload'

export function FileHandler() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-6">
      {files.length === 0 ? (
        <UploadComponent onUpload={setFiles} />
      ) : (
        <div className="text-green-500">
          {files.length} file(s) selected
          <button 
            onClick={() => setFiles([])}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}