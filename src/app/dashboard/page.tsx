'use client';

import { useEffect, useState } from 'react';
import { fetchFromAPI } from '@/lib/api';
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from '@/components/mode-toggle';

export default function DashboardPage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function testConnection() {
      try {
        const data = await fetchFromAPI('/api/test');
        setMessage(data.message);
      } catch (error) {
        console.error('Error connecting to API:', error);
        setMessage('Failed to connect to API');
      }
    }

    testConnection();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p>API Status: {message}</p>
          {/* Settings content */}
        </div>
      <ModeToggle/>
      </SidebarInset>
    </SidebarProvider>
  )
} 
