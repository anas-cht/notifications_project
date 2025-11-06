import React, { useState ,useMemo } from 'react';
import { Plus, X, Settings } from 'lucide-react';
import { addCategory } from '../../services/CategoryService';



interface Collaborator {
    id: string;
    email: string;
    email2: string;
    fullName: string;
    phoneNumber: string;
    isActive: boolean;
    category_id: number |undefined ;
}

interface FormData {
    id?:number
    name: string;
    description: string;
    isActive: boolean;
    collaborators_count:number;
    notifications_count:number;
    recipients?: Collaborator[]; 
}

interface AddCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: FormData) => void;
  collaborators:Collaborator[];
}

interface FormErrors {
  name: string;
  description: string;
}

function AddCategoryForm({ isOpen, onClose,collaborators,onAdd }: AddCategoryFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    isActive: true,
    collaborators_count:0,
    notifications_count:0,
    recipients:[]
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: '',
    description: '',
  });

      const [recipientFilter, setRecipientFilter] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const response= await addCategory(formData);
    console.log("category created:",response.data);
    onAdd(response.data);
    onClose();

    // onAdd(newModule);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      isActive: true,
      collaborators_count:0,
      notifications_count:0,
      recipients:[]
    });
    setErrors({ name: '', description: '' });
    onClose();
  };
  const filteredCollaborators = useMemo(() => {
    return collaborators
      .filter(c => !c.category_id) // only collaborators without category
      .filter(c =>
        c.fullName.toLowerCase().includes(recipientFilter.toLowerCase()) ||
        c.email.toLowerCase().includes(recipientFilter.toLowerCase())
      );
  }, [recipientFilter, collaborators]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Settings className="mr-2 h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Add New Module</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

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

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collaborators
              </label>
              <input
                type="text"
                placeholder="Search collaborators..."
                value={recipientFilter}
                onChange={(e) => setRecipientFilter(e.target.value)}
                className="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="max-h-48 overflow-y-auto border rounded-lg p-2">
                {filteredCollaborators.map(c => (
                  <label key={c.id} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={formData.recipients && formData.recipients.some(r => r.id === c.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            recipients: [...(formData.recipients || []), c]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            recipients:formData.recipients && formData.recipients.filter(r => r.id !== c.id)
                          });
                        }
                      }}
                    />
                    {c.email} ({c.email2})
                  </label>
                ))}
              </div>
            </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active module
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Module
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategoryForm;