// import React from 'react';
import { useEffect, useState } from 'react';
import { Bell, Users, Mail, UserPlus, FolderPlus, BellPlus } from 'lucide-react';
import { allCategory } from '../services/CategoryService';
import { allCollaborator } from '../services/CollaboratorService';
import { useNavigate } from "react-router-dom";
import { allNotifications, Notification } from '../services/NotificationService';
import { Category } from './Category';

// 🕒 helper function to format dates
function formatDate(dateString?: string): string {
  if (!dateString) return "Unknown date";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function Dashboard() {
    const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [collaboratorCount, setCollaboratorCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categorys = await allCategory();
        setCategories(categorys.data);
        setCategoryCount(categorys.data.length);

        const collaborators = await allCollaborator();
        setCollaboratorCount(collaborators.data.length);

        const notifications = await allNotifications();
        setNotificationCount(notifications.data.length);

        // sort by sentAt (string -> Date) desc
        const sortedNotifications = notifications.data
          .filter((n: Notification) => n.sentAt) 
          .sort(
            (a: Notification, b: Notification) =>
              new Date(b.sentAt as string).getTime() -
              new Date(a.sentAt as string).getTime()
          );

        setRecentNotifications(sortedNotifications.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  function getCategoryName(categoryId?: number): string {
    if (!categoryId) return "Unknown Module";
    const found = categories.find(c => c.id === categoryId);
    return found ? found.description : "Unknown Module";
  }


  const stats = [
    {
      title: 'Notifications Sent',
      value: notificationCount.toString(),
      change: '+12%',
      icon: Mail,
      color: 'text-blue-600',
    },
    {
      title: 'Active Collaborators',
      value: collaboratorCount.toString(),
      change: '+5%',
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Configured Modules',
      value: categoryCount.toString(),
      change: '+2',
      icon: Bell,
      color: 'text-purple-600',
    },
  ];

  const actions = [
    {
      title: "Add Collaborator",
      description: "Quickly register a new collaborator to the system.",
      icon: <UserPlus className="h-8 w-8 text-blue-500" />,
      onClick: () => navigate("/collaborators", { state: { openAddForm: true } }),
    },
    {
      title: "Add Category",
      description: "Create a new category to organize your data.",
      icon: <FolderPlus className="h-8 w-8 text-green-500" />,
      onClick: () => navigate("/category", { state: { openAddForm: true } }),
    },
    {
      title: "Add Notification",
      description: "Send a new notification to selected users.",
      icon: <BellPlus className="h-8 w-8 text-yellow-500" />,
      onClick: () => navigate("/notifications", { state: { openAddForm: true } }),
    },
  ];

  const topCategories = [...categories]
  .sort((a, b) => (b.notifications_count ?? 0) - (a.notifications_count ?? 0))
  .slice(0, 4);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your notification platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 h-40">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow w-80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-medium text-gray-600">
                  {stat.title}
                </h3>
                <Icon className={`h-10 w-10 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold flex items-center justify-center">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
          <div className="space-y-4">
            {recentNotifications.length > 0 ? (
              recentNotifications.map((notif, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {notif.title || "Notification sent"}
                    </p>
                    <p className="text-xs text-gray-500">
                    {getCategoryName(notif.category_id)} • {formatDate(notif.sentAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent notifications</p>
            )}
          </div>
        </div>

        {/* Most Active Modules */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Most Active Modules</h3>
          <div className="space-y-4">
            {topCategories.map((module, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="w-6 text-gray-500">{index + 1}.</span>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{module.description}</span>
                    <span className="text-sm text-gray-500">
                      {module.notifications_count} notifications
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fast Actions */}
      <div className="bg-white shadow-md rounded-xl p-8 mt-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Fast Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {actions.map((action, idx) => (
            <div
              key={idx}
              className="flex flex-col items-start p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-gray-50"
            >
              <div className="mb-3">{action.icon}</div>
              <h3 className="text-lg font-medium text-gray-800">{action.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{action.description}</p>
              <button
                onClick={action.onClick}
                className="mt-auto px-4 py-2 bg-black text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
              >
                Go
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
