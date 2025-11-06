import axios from 'axios';
import { Collaborator } from '../pages/Collaborators';

export interface Notification {
    id?: number;
    title: string;
    createdAt?:string;
    sentAt?:string;
    isActive: boolean;
    category_id:number;
    template_id:number;
    recipients?:Collaborator[];
  }

export interface template{
    id?:number;
    name:string;
}

export const sendNotification = async (notification:Notification) => {
    const token = localStorage.getItem('token');
    return axios.post('http://localhost:8080/api/notification/sendnotification', notification,{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }

    export const allTemplates = async () => {
        const token = localStorage.getItem('token');
        return axios.get('http://localhost:8080/api/notification/getalltemplates',{
            headers: {
              Authorization: `Bearer ${token}`,
            //   'Content-Type': 'application/json',
            },
          });
        }

        export const allNotifications = async () => {
            const token = localStorage.getItem('token');
            return axios.get('http://localhost:8080/api/notification/getallnotifications',{
                headers: {
                  Authorization: `Bearer ${token}`,
                //   'Content-Type': 'application/json',
                },
              });
            }

            export const enableNotification = async (id:number) => {
                const token = localStorage.getItem('token');
                return axios.put(`http://localhost:8080/api/notification/enablenotification/${id}`, {},{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                    });
              };

              export const deleteNotification = async (id:number) => {
                const token = localStorage.getItem('token');
                return axios.put(`http://localhost:8080/api/notification/deletenotification/${id}`, {},{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                    });
              };