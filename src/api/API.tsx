import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.github.com/',
  headers: {
    Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
  },
});

export const fetchCandidate = async (username: string) => {
  const response = await api.get(`/users/${username}`);
  return response.data;
};
