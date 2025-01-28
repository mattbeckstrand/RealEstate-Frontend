"use client";

import { useEffect, useState } from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function AnalysisPage() {
  const [fileData, setFileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem('aiResponse');
    if (data) {
      setFileData(JSON.parse(data));
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Analyzing document...</span>
      </div>
    );
  }

  if (!fileData) {
    return <div className="p-4">Loading file data...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </header>
          <main className="flex-1 overflow-y-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Analysis Results</h1>
            <div className="mb-4">
              <h2 className="text-xl mt-4 mb-2">AI Analysis</h2>
              <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
                {fileData.aiResponse}
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
} 
