import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, 
  Users, 
  Settings, 
  Home,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminInfoModal from '../AdminInfoModal';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const {logout,user}=useAuth();
  const [showAdminInfo, setShowAdminInfo] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'Category', label: 'Category', icon: Settings, path: '/category' },
    { id: 'collaborators', label: 'Collaborators', icon: Users, path: '/collaborators' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },

  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">
            Notification Hub
          </h1>
            <p className="text-lg text-gray-600 mt-1 ml-7">
                {user?.fullname}
            </p>
                <button
                onClick={() => setShowAdminInfo(true)}
                className="text-white hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 ml-14"
                title="View admin information"
                >
                <User className="h-7 w-7 bg-black rounded-md"/>
                </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-black text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      <AdminInfoModal
        isOpen={showAdminInfo}
        onClose={() => setShowAdminInfo(false)}
        // admin={user}
      />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;