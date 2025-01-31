"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FileResult {
  filename: string;
  file_type: string;
  analysis: string;
  raw_analyses?: string[];
}

interface AnalysisData {
  individual_analyses: FileResult[];
  combined_analysis: string;
}

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('aiResponse');
      if (!storedData) {
        setError("No analysis data found. Please upload files first.");
        return;
      }
      const parsedData = JSON.parse(storedData);
      setAnalysisData(parsedData);
    } catch (err) {
      setError("Failed to load analysis data. Please try uploading files again.");
    }
  }, []);

  const handleBack = () => {
    router.push('/upload');
  };

  if (error) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <div className="flex-1">
          <header className="flex h-16 items-center gap-4 border-b px-6">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
          </header>
          <main className="flex-1 space-y-4 p-8 pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={handleBack}>Back to Upload</Button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1">
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
        </header>
        <main className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Analysis Results</h1>
            <Button onClick={handleBack}>Back to Upload</Button>
          </div>

          {analysisData ? (
            <div className="space-y-6">
              {/* Combined Investment Analysis */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Investment Analysis Summary</h2>
                <div className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
                  {analysisData.combined_analysis}
                </div>
              </Card>

              {/* Individual File Analyses */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Individual Document Analyses</h2>
                <Accordion type="single" collapsible className="w-full">
                  {analysisData.individual_analyses.map((result, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-xl">
                        {result.filename} ({result.file_type})
                      </AccordionTrigger>
                      <AccordionContent>
                        <Tabs defaultValue="final" className="w-full">
                          <TabsList>
                            <TabsTrigger value="final">Final Analysis</TabsTrigger>
                            {result.raw_analyses && result.raw_analyses.length > 0 && (
                              <TabsTrigger value="raw">Raw Analyses</TabsTrigger>
                            )}
                          </TabsList>
                          <TabsContent value="final">
                            <div className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
                              {result.analysis}
                            </div>
                          </TabsContent>
                          {result.raw_analyses && result.raw_analyses.length > 0 && (
                            <TabsContent value="raw">
                              <div className="space-y-4">
                                {result.raw_analyses.map((analysis, i) => (
                                  <div key={i} className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
                                    <h3 className="font-bold mb-2">Section {i + 1}</h3>
                                    {analysis}
                                  </div>
                                ))}
                              </div>
                            </TabsContent>
                          )}
                        </Tabs>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading analysis results...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 
