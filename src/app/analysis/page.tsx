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

// Error Boundary Component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (error: Error) => {
      setHasError(true);
      setError(error);
    };

    window.addEventListener('error', (event) => handleError(event.error));
    return () => window.removeEventListener('error', (event) => handleError(event.error));
  }, []);

  if (hasError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Something went wrong: {error?.message}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

// Loading Skeleton Component
const AnalysisSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <Card className="p-6">
      <div className="h-8 w-64 bg-muted rounded mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/6" />
      </div>
    </Card>
    <Card className="p-6">
      <div className="h-8 w-64 bg-muted rounded mb-4" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-muted rounded" />
        ))}
      </div>
    </Card>
  </div>
);

// Individual Analysis Component
const IndividualAnalysis = ({ result }: { result: FileResult }) => (
  <AccordionItem value={result.filename}>
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
);

// Combined Analysis Component
const CombinedAnalysis = ({ analysis }: { analysis: string }) => (
  <Card className="p-6">
    <h2 className="text-2xl font-bold mb-4">Investment Analysis Summary</h2>
    <div className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
      {analysis}
    </div>
  </Card>
);

// Main Analysis Content Component
const AnalysisContent = ({ data }: { data: AnalysisData }) => (
  <div className="space-y-6">
    <CombinedAnalysis analysis={data.combined_analysis} />
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Individual Document Analyses</h2>
      <Accordion type="single" collapsible className="w-full">
        {data.individual_analyses.map((result) => (
          <IndividualAnalysis key={result.filename} result={result} />
        ))}
      </Accordion>
    </Card>
  </div>
);

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
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
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleBack = () => {
    router.push('/upload');
  };

  const handleExport = () => {
    if (!analysisData) return;
    
    const blob = new Blob([JSON.stringify(analysisData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analysis-results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Analysis Results</h1>
            <div className="space-x-4">
              <Button onClick={handleExport} disabled={!analysisData}>
                Export Results
              </Button>
              <Button onClick={handleBack}>Back to Upload</Button>
            </div>
          </div>

          <ErrorBoundary>
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : isLoading ? (
              <AnalysisSkeleton />
            ) : analysisData ? (
              <AnalysisContent data={analysisData} />
            ) : null}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
} 
