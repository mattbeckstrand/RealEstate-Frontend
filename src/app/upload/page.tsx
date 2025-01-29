"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, X } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FileType = 'rent_roll' | 'financials' | 'om';

interface FileWithType {
  file: File;
  type: FileType | null;
}

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<FileWithType[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).map(file => ({
        file,
        type: null
      }));
      setSelectedFiles(prev => [...prev, ...newFiles]);
      setError(null);
    }
  };

  const handleFileTypeChange = (index: number, type: FileType) => {
    setSelectedFiles(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], type };
      return updated;
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateFile = (file: File, type: FileType) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (type === 'om' && extension !== 'pdf') {
      return 'Offering Memorandum must be a PDF file';
    }
    if ((type === 'rent_roll' || type === 'financials') && 
        !['xls', 'xlsx'].includes(extension || '')) {
      return 'Rent Roll and Financials must be Excel files (.xls or .xlsx)';
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFiles.length === 0) return;

    // Check if all files have types assigned
    if (selectedFiles.some(f => f.type === null)) {
      setError("Please specify file type for all files");
      return;
    }

    // Validate all files
    for (const { file, type } of selectedFiles) {
      const validationError = validateFile(file, type!);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setError(null);
    const formData = new FormData();
    selectedFiles.forEach(({ file, type }, index) => {
      formData.append("files", file);
      formData.append("file_types", type!);
    });

    try {
      setIsUploading(true);
      const response = await axios.post("http://127.0.0.1:8000/api/uploads/", formData);
      localStorage.setItem('aiResponse', JSON.stringify(response.data));
      router.push('/analysis');
    } catch (error: any) {
      console.error("Error:", error);
      setError(
        error.response?.data?.detail || 
        "Failed to upload and analyze files. Please try again."
      );
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1">
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
        </header>
        <main className="flex-1 space-y-4 p-8 pt-6">
          <Card className="mx-auto max-w-[600px]">
            <CardHeader>
              <CardTitle>Upload Property Data</CardTitle>
              <CardDescription>Add files and specify their types</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="files">Choose Files</Label>
                    <input 
                      id="files"
                      type="file" 
                      multiple
                      onChange={handleFileSelect}
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-primary-foreground
                        hover:file:bg-primary/90"
                      disabled={isUploading}
                      accept=".pdf,.xls,.xlsx"
                    />
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Specify File Types</Label>
                      {selectedFiles.map((fileWithType, index) => (
                        <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                          <span className="flex-1 truncate text-sm">
                            {fileWithType.file.name}
                          </span>
                          <Select
                            value={fileWithType.type || undefined}
                            onValueChange={(value: FileType) => handleFileTypeChange(index, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rent_roll">Rent Roll</SelectItem>
                              <SelectItem value="financials">Financials</SelectItem>
                              <SelectItem value="om">OM</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(index)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isUploading || selectedFiles.length === 0 || selectedFiles.some(f => f.type === null)}
                    className="w-full"
                  >
                    {isUploading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Analyzing Files...</span>
                      </div>
                    ) : (
                      <span>Upload and Analyze</span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <ModeToggle />
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}
