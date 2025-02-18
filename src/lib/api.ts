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

interface UploadResponse {
  status: string;
  data: {
    t12Data?: T12Data;
  };
}

export async function uploadFilesToAPI(
  files: File[],
  fileTypes: string[]
): Promise<UploadResponse> {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append('files', file);
    formData.append('file_types', fileTypes[index]);
  });
  const response = await fetch(`${API_BASE_URL}/api/upload-analyze`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
}
