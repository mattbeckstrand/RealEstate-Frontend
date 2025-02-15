// src/components/FileHandler.tsx
"use client"

import { useState } from "react"
import { UploadComponent } from '@/components/upload'
import { FileWithType } from '@/types/files'
import { uploadFilesToAPI } from "@/lib/api";


export function FileHandler() {
  const [files, setFiles] = useState<FileWithType[]>([]);

  const areAllTypesSelected = () => {
    return files.every(file => file.type !== null);
  }

  const handleSubmit = async () => {
    try{
      const filesToUpload = files.map(f => f.file);
      const fileTypes = files.map(f => f.type as string);
      console.log(fileTypes.length)
      console.log(files.length)
      const response = await uploadFilesToAPI(filesToUpload, fileTypes);
      console.log('Upload successful: ', response);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }

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
          <button
            onClick={handleSubmit}
            disabled={!areAllTypesSelected}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Upload Files
            </button>
        </div>
      )}
    </div>
  );
}