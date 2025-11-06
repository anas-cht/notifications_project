import axios from 'axios';
import { Collaborator } from '../pages/Collaborators';

interface Category {
    id?:number;
    name: string;
    description:string;
    isActive: boolean;
    collaborators_count:number;
    notifications_count:number;
    recipients?:Collaborator[];
}


export const addCategory = async (category:Category) => {
    const token = localStorage.getItem('token');
    return axios.post('http://localhost:8080/api/category/addcategory', category,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }

    export const allCategory = async () => {
        const token = localStorage.getItem('token');
        return axios.get('http://localhost:8080/api/category/allcategorys',{
            headers: {
              Authorization: `Bearer ${token}`,
            //   'Content-Type': 'application/json',
            },
          });
        }


    export const updateCategory = async (category:Category) => {
        const token = localStorage.getItem('token');
        return axios.post('http://localhost:8080/api/category/updatecategory',category,{
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }

        export const changeStatus = async (id?:number) => {
            const token = localStorage.getItem('token');
            console.log(token);
            return axios.put(`http://localhost:8080/api/category/statuschange/${id}`,{},{
                headers: {
                  Authorization: `Bearer ${token}`,
                //   'Content-Type': 'application/json',
                },
              });
            }