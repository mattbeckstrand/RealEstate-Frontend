// src/components/FileHandler.tsx
"use client"

import { useState } from "react"
import { UploadComponent } from '@/components/upload'
import { FileWithType } from '@/types/files'


export function FileHandler() {
  const [files, setFiles] = useState<FileWithType[]>([]);


  const handleTypeChange = (fileIndex: number, newType: string) => {
    const updatedFiles = [...files];
    updatedFiles[fileIndex].type = newType;
    setFiles(updatedFiles);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-6">
      {files.length === 0 ? (
        <UploadComponent onUpload={setFiles} />
      ) : (
        <div>
          {files.map((fileItem, index) => (
            <div key={index}>
                <span>{fileItem.file.name}</span>
                <select
                    value={fileItem.type || ''}
                    onChange={(e) => handleTypeChange(index, e.target.value)}
                >
                    <option value = "" disabled>Select type...</option>
                    <option value="om">Offering Memorandum</option>
                    <option value="t12">T12</option>
                    <option value="rr">Rent Roll</option>
                </select>
                </div>

          ))}
        </div>
      )}
    </div>
  );
}