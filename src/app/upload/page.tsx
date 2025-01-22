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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle";


const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);
      const response = await axios.post("http://127.0.0.1:8000/api/uploads/", formData);
      localStorage.setItem('aiResponse', JSON.stringify(response.data));
      router.push('/analysis');
    } catch (error) {
      console.error("Error:", error);
      setIsUploading(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Upload Property Data</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <input 
                type="file" 
                onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} 
                className="block w-full"
                disabled={isUploading}
              />
              <Button 
                type="submit" 
                disabled={isUploading}
                className="flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <span>Upload</span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ModeToggle />
      </CardFooter>
    </Card>
    </SidebarInset>
    </SidebarProvider>
  )
}

export default FileUpload;
