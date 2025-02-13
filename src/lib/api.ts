

const API_BASE_URL = 'http://localhost:8000';

export async function fetchFromAPI(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
} 

interface UploadResponse {
  individual_analyses: Array<{
    filename: string;
    file_type: string;
    analysis: string;
    raw_analyses: any[];
  }>;
  combined_analysis: string;
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
  const response = await fetch(`${API_BASE_URL}/api/uploads`, {
    method: 'POST',
    body: formData
  })
  if (!response.ok) {
    throw new Error('Upload failed');
}

return response.json(); 
}
