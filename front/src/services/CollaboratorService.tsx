import axios from 'axios';

interface Collaborator {
    id:string;
    fullName: string;
    email: string;
    email2: string;
    phoneNumber:string,
    isActive: boolean;
    category_id?: number 
}


export const addCollaborator = async (collaborator:Collaborator) => {
    const token = localStorage.getItem('token');
    return axios.post('http://localhost:8080/api/collaborator/addcollaborator', collaborator,{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  };

  export const allCollaborator = async () => {
    const token = localStorage.getItem('token');
    return axios.get('http://localhost:8080/api/collaborator/allcollaborators', {
        headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'application/json',
          },
        });
  };

  export const updateCollaborator = async (collaborator:Collaborator) => {
    const token = localStorage.getItem('token');
    return axios.post('http://localhost:8080/api/collaborator/updatecollaborator', collaborator,{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  };

  export const statusChange = async (id:string) => {
    const token = localStorage.getItem('token');
    return axios.put(`http://localhost:8080/api/collaborator/disablecollaborator/${id}`, {},{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  };