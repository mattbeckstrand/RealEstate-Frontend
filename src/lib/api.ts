const API_BASE_URL = 'http://localhost:8000';

export async function fetchFromAPI(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
} 

interface CleanedData {
  category: string;
  level: number;
  [key: string]: any; // For monthly values and total
}

interface T12Data {
  cleaned_data: CleanedData[];
  message: string;
}

export interface RentalIncomeData {
  monthly_rent: number;
  annual_rent: number;
  occupancy_rate: number;
  effective_gross_income: number;
}

interface UploadResponse {
  status: string;
  data: {
    t12Data?: T12Data;
    gpt?: any; // Keep this as is if you're using it
  };
  rental_income: RentalIncomeData;
}

export const uploadFilesToAPI = async (
  files: File[],
  fileTypes: string[]
): Promise<UploadResponse> => {
  const formData = new FormData();
  
  files.forEach((file, index) => {
    formData.append('files', file);
  });
  
  fileTypes.forEach((type, index) => {
    formData.append('file_types', type);
  });
  
  const response = await fetch('/api/upload-analyze', {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail?.message || 'Upload failed');
  }
  
  return await response.json();
};
