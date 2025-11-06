import axios from 'axios';


export const signin = async (credentials: { email: string; password: string }) => {
    return axios.post('http://localhost:8080/api/auth/signin', credentials);
  };