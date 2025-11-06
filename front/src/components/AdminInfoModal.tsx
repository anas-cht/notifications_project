import React from 'react';
import { X, User, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AdminInfoModal({ isOpen, onClose }: AdminInfoModalProps) {
  const { user: admin } = useAuth();
  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Administrator Information</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <MapPin className="mr-3 h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">id</p>
                <p className="font-medium">{admin.id }</p>
              </div>
            </div>

          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <User className="mr-3 h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{admin.fullname}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Mail className="mr-3 h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{admin.email}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Phone className="mr-3 h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{admin.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <Shield className="mr-3 h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Role</p>
                <p className="font-medium text-blue-800">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminInfoModal;
