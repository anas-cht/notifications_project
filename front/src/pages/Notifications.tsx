import React, { useEffect, useState } from 'react';
import { Plus, Search, Trash2, Check } from 'lucide-react'; // added icons
import { format } from 'date-fns';
import AddNotificationForm from '../components/Forms/AddNotificationForm';
import { allCategory } from '../services/CategoryService';
import { allNotifications, allTemplates, deleteNotification, enableNotification } from '../services/NotificationService';
import { useLocation } from "react-router-dom";
import { Collaborator } from './Collaborators';
import { allCollaborator } from '../services/CollaboratorService';

interface Notification {
    id: number;
    title: string;
    createdAt?:string;
    sentAt?:string;
    isActive: boolean;
    category_id:number;
    template_id:number;
    recipients?:Collaborator[];
}

interface Module {
  id: number;
  description: string;
}

interface Template {
  id?: number;
  name: string;
}

function Notifications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [collaborators,setCollaborators]=useState<Collaborator[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setModules((await allCategory()).data);
        setTemplates((await allTemplates()).data);
        setNotifications((await allNotifications()).data);
        setCollaborators((await allCollaborator()).data);

        if (location.state?.openAddForm) {
            setShowAddForm(true);
          }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddNotification = (newNotification: Notification) => {
    setNotifications([newNotification, ...notifications]);
  };

  // Delete notification
  const handleDelete = async(id?: number) => {
    if (!id) return;
    setNotifications(notifications.filter((n) => n.id !== id));

    const response=await deleteNotification(id);
    console.log(response.data);
    
  };

  // Toggle isActive
  const handleActivate = async(id?: number) => {
    if (!id) return;
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, isActive: true } : n
      )
    );
    const response=await enableNotification(id);
    console.log("notification enabled:",response.data);
  };

  const filteredNotifications = notifications.filter((notification) =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">Manage and track your notifications</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Notification
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Notifications List</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const module = modules.find((m) => m.id === notification.category_id);

              return (
                <div
                  key={notification.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  {/* Notification Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{notification.title}</h3>
                      <span
                        className={`ml-2 px-2 py-1 text-sm rounded-full ${
                          notification.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {notification.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {notification.createdAt && (
                        <span>
                          Created:{' '}
                          {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm')}
                        </span>
                      )}
                      {notification.sentAt && (
                        <span>
                          Sent: {format(new Date(notification.sentAt), 'dd/MM/yyyy HH:mm')}
                        </span>
                      )}
                    </div>

                    {/* Category */}
                    {module && (
                      <h3 className="font-medium text-sm text-gray-700 mt-2">
                        Category: {module.description}
                      </h3>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {!notification.isActive && (
                      <button
                        onClick={() => handleActivate(notification.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 flex items-center text-sm"
                      >
                        <Check className="h-4 w-4 mr-1" /> Activate
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center text-sm"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Notification Form */}
      <AddNotificationForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdd={handleAddNotification}
        modules={modules}
        templates={templates}
        collaborators={collaborators}
      />
    </div>
  );
}

export default Notifications;
