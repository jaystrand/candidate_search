import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  },
});

export const fetchInfo = async () => {
  const response = await api.get(`/users?since=${Math.floor(Math.random() * 20)}`);
   return response.data;
};

export const fetchCandidate = async (username: string) => {  
  const response = await api.get(`/users/${username}`);
  return response.data;
};
