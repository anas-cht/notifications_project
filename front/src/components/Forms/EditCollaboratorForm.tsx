import React, { useState, useEffect } from 'react';
import { X, User, Save } from 'lucide-react';
import{Collaborator} from '../../pages/Collaborators'
import { updateCollaborator } from '../../services/CollaboratorService';

interface EditCollaboratorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (collaborator: Collaborator) => void;
  collaborator: Collaborator | null;
}

interface FormData {
    id:string,
    email:string,
    email2:string,
    fullName:string,
    phoneNumber:string,
    isActive:boolean
}

interface FormErrors {
    id:string;
  fullName: string;
  email: string;
  email2:string;
  phoneNumber:string,
}

function EditCollaboratorForm({ isOpen, onClose, onEdit, collaborator }: EditCollaboratorFormProps) {
  const [formData, setFormData] = useState<FormData>({
    id:'',
    fullName:'',
    email: '',
    email2: '',
    phoneNumber:'',
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({
    id: '',
    fullName: '',
    email: '',
    email2:'',
    phoneNumber:''
  });

  useEffect(() => {
    if (collaborator) {
      setFormData({
        id:collaborator.id,
        fullName: collaborator.email,
        email: collaborator.email2,
        email2: collaborator.fullName,
        phoneNumber: collaborator.phoneNumber,
        isActive: collaborator.isActive,
      });
    }
  }, [collaborator]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
        id:'',
      fullName: '',
      email: '',
      email2:'',
      phoneNumber:'',
    };

    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.id.trim()) {
      newErrors.id = 'id is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
        newErrors.id = 'phoneNumber is required';
        isValid = false;
      }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !collaborator) return;

    const response =await updateCollaborator(formData);
    console.log("collaborator edited:",response.data);
    onEdit(response.data);
    setErrors({ id: '', fullName: '',email:'',email2:'',phoneNumber:'' });
    onClose();

  };


  const handleClose = () => {
    setErrors({ fullName: '', id: '', email: '',phoneNumber:'',email2:'' });
    onClose();
  };

  if (!isOpen || !collaborator) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <User className="mr-2 h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Edit Collaborator</h2>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Id 
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.id ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter Id"
            />
            {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter full name"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email2
            </label>
            <input
              type="email"
              value={formData.email2}
              onChange={(e) => setFormData({ ...formData, email2: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
                {errors.email2 && <p className="mt-1 text-sm text-red-600">{errors.email2}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PhoneNumber
            </label>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
            >
              <Save className="mr-1 h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCollaboratorForm;