// src/components/FileHandler.tsx
"use client"

import { useState } from "react"
import { UploadComponent } from '@/components/upload'
import { FileWithType } from '@/types/files'
import { uploadFilesToAPI, RentalIncomeData } from "@/lib/api"
import { DashboardTab } from './DashboardTab'

interface CleanedData {
  category: string;
  level: number;
  [key: string]: any; // For monthly values and total
}

export function FileHandler() {
  const [files, setFiles] = useState<FileWithType[]>([]);
  const [cleanedData, setCleanedData] = useState<CleanedData[]>([]);
  const [gpi, setGpi] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rentalIncomeData, setRentalIncomeData] = useState<RentalIncomeData | undefined>(undefined);

  const areAllTypesSelected = () => {
    return files.every(file => file.type !== null);
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const filesToUpload = files.map(f => f.file);
      const fileTypes = files.map(f => f.type as string);
      console.log(fileTypes.length);
      console.log(files.length);
      
      const response = await uploadFilesToAPI(filesToUpload, fileTypes);
      
      if (response.data?.t12Data?.cleaned_data) {
        setCleanedData(response.data.t12Data.cleaned_data);
      }
      if (response.data?.gpt?.gpi) {
        setGpi(response.data.gpt.gpi);
      }
      
      // Store the rental income data
      if (response.rental_income) {
        setRentalIncomeData(response.rental_income);
      }
      
      console.log('Upload successful: ', response);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to process files. Please try again.');
    } finally {
      setIsLoading(false);
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
        <div className="w-full">
          {files.map((fileItem, index) => (
            <div key={index} className="mb-4">
              <span>{fileItem.file.name}</span>
              <select
                value={fileItem.type || ''}
                onChange={(e) => handleTypeChange(index, e.target.value)}
                className="ml-4 p-2 border rounded"
              >
                <option value="" disabled>Select type...</option>
                <option value="om">Offering Memorandum</option>
                <option value="t12">T12</option>
                <option value="rr">Rent Roll</option>
              </select>
            </div>
          ))}
          <button
            onClick={handleSubmit}
            disabled={!areAllTypesSelected() || isLoading}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            {isLoading ? 'Processing...' : 'Upload Files'}
          </button>

          {error && (
            <div className="mt-4 p-4 border border-red-500 rounded bg-red-100 text-red-700">
              {error}
            </div>
          )}

          {rentalIncomeData && (
            <div className="mt-8">
              <DashboardTab rentalIncome={rentalIncomeData} />
            </div>
          )}

          {cleanedData.length > 0 && (
            <div className="mt-8 w-full overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-500">
                    <th className="border p-2">Category</th>
                    <th className="border p-2">Level</th>
                    {Array.from({ length: 12 }, (_, i) => (
                      <th key={i} className="border p-2">Month {i + 1}</th>
                    ))}
                    <th className="border p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cleanedData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-500">
                      <td className="border p-2">{row.category}</td>
                      <td className="border p-2">{row.level}</td>
                      {Array.from({ length: 12 }, (_, i) => (
                        <td key={i} className="border p-2">
                          {typeof row[`month_${i + 1}`] === 'number' 
                            ? row[`month_${i + 1}`].toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD'
                              })
                            : '-'
                          }
                        </td>
                      ))}
                      <td className="border p-2">
                        {typeof row.total === 'number'
                          ? row.total.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            })
                          : '-'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>{cleanedData.find(row => row.category === "Total Income")?.total.toLocaleString()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}