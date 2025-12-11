import axios from 'axios';

const API_URL = '/api'; 

axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

export const apiService = {
  verifyToken: async (token: string) => {
    const response = await axios.post(`${API_URL}/verify-token`, { token });
    return response.data;
  },

  startSession: async (userName: string) => {
    const response = await axios.post(`${API_URL}/session/start`, { userName });
    return response.data; 
  },

  uploadOne: async (videoBlob: Blob, questionIndex: number, userName: string, transcript: string) => {
    const formData = new FormData();
    
    formData.append('userName', userName); 
    formData.append('index', questionIndex.toString());
    formData.append('transcript', transcript || "Answer cannot be recorded clearly");
    formData.append('video', videoBlob, `question_${questionIndex + 1}.webm`);

    const response = await axios.post(`${API_URL}/upload-one`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  joinWaitingRoom: async (name: string, email: string) => {
    return await axios.post(`${API_URL}/waiting/join`, { name, email });
  },

  getWaitingCandidates: async () => {
    const response = await axios.get(`${API_URL}/waiting/list`);
    return response.data.candidates; 
  },

  finishSession: async (userName: string) => {
    return await axios.post(`${API_URL}/session/finish`, { userName });
  },

  getPositions: async () => {
    const response = await axios.get(`${API_URL}/positions`);
    return response.data;
  },

  addPosition: async (title: string) => {
    const response = await axios.post(`${API_URL}/positions/add`, { title });
    return response.data;
  },

  updatePosition: async (id: string, questions: string[]) => {
    const response = await axios.post(`${API_URL}/positions/update`, { id, questions });
    return response.data;
  }
};