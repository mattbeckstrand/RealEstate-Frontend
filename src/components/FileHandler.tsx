// src/components/FileHandler.tsx
"use client"

import { useState } from "react"
import { UploadComponent } from '@/components/upload'

export function FileHandler() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div>
      {files.length === 0 ? (
        <UploadComponent onUpload={setFiles} />
      ) : (
        <div>hello</div>
      )}
    </div>
  );
}