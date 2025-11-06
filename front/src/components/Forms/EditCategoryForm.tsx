import React, { useState, useEffect } from 'react';
import { X, Settings, Save } from 'lucide-react';
import { Category } from '../../pages/Category';
import { updateCategory } from '../../services/CategoryService';

interface EditModuleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (category:Category) => void;
  category: Category | null;
}


interface FormData {
  id?:number;
  name: string;
  description: string;
  isActive: boolean;
  collaborators_count:number;
  notifications_count:number;
}

interface FormErrors {
  name: string;
  description: string;
}

function EditModuleForm({ isOpen, onClose, category,onEdit }: EditModuleFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    isActive: true,
    collaborators_count:0,
    notifications_count:0
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    description: '',
  });

    const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (category) {
      setFormData({
        id:category.id,
        description: category.name,
        name: category.description,
        isActive: category.isActive,
        collaborators_count:category.collaborators_count,
        notifications_count:category.notifications_count
      });
    }
  }, [category]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: '',
      description: '',
    };

    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Module name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !category) return;
    if(category.description==formData.name && category.name==formData.description) 
        {setError("no field(s) is(are) changed");
            return;
        }

    const response=await updateCategory(formData);
    console.log('category updated',response.data);
    console.log(category.name);
    onEdit(response.data);
    setErrors({ name: '', description: '' });
    onClose();
  };

  const handleClose = () => {

    setErrors({ name: '', description: '' });
    setError(null);
    onClose();
  };

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Edit Module</h2>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Module Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter module name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter module description"
              rows={3}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
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

export default EditModuleForm;