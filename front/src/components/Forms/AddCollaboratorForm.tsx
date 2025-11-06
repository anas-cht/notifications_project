import React, { useState } from 'react';
import { Plus, X, User } from 'lucide-react';
import { addCollaborator } from '../../services/CollaboratorService';
import { Category } from '../../pages/Category'


interface FormData {
    id:string;
    fullName: string;
    email: string;
    email2: string;
    phoneNumber:string,
    isActive: boolean;
    category_id: number |undefined ;
}

interface AddCollaboratorFormProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (collaborator: FormData) => void;
  }

interface FormErrors {
    id:string;
  fullname: string;
  phone: string;
  email: string;
//   categoryId:string,

}

function AddCollaboratorForm({ isOpen, onClose,onAdd }: AddCollaboratorFormProps) {
  const [formData, setFormData] = useState<FormData>({
    id:'',
    fullName: '',
    phoneNumber: '',
    email: '',
    email2:'',
    isActive: true,
    category_id:0,
  });

  const [errors, setErrors] = useState<FormErrors>({
    id:'',
    fullname: '',
    phone: '',
    email: '',
    // categoryId:'',
  });

  const [categorys] = useState(() => {
    const stored = localStorage.getItem('categories');
    return stored ? JSON.parse(stored) : [];
  });
  

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
        id:'',
      fullname: '',
      phone: '',
      email: '',
    //   categoryId:'',

    };

    let isValid = true;

    if (!formData.id.trim()) {
        newErrors.id = 'id is required';
        isValid = false;
      }

    if (!formData.fullName.trim()) {
      newErrors.fullname = 'Full Name is required';
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phone = 'Phone Numberis required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    // if (!formData.category_id) {
    //     newErrors.categoryId = 'Category is required';
    //     isValid = false;
    //   }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try{
        const response = await addCollaborator(formData);
        console.log('Collaborator created:', response.data);
        onAdd(response.data);
        onClose();
    }
    catch(error){
        console.error('Signup error:', error);
    }
    // onAdd(newCollaborator);
    
    // Reset form
    setFormData({
        id:'',
      fullName: '',
      phoneNumber: '',
      email: '',
      email2:'',
      isActive: true,
      category_id:  0

    });
    setErrors({ id:'', fullname: '', phone: '', email: '' , 
        // categoryId:''
     });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <User className="mr-2 h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Add New Collaborator</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              id*
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.id ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter matricule"
            />
            {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              FullName*
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullname ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter full name"
            />
            {errors.fullname && <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="text"
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 `}
              placeholder="Enter the second email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PhoneNumber*
            </label>
            <input
            type="text"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter phone Number"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Category*
            </label>
            <div className="flex flex-col space-y-2">
                {categorys.map((category:Category ) => (
                <label key={category.id} className="flex items-center space-x-2">
                    <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={formData.category_id === category.id}
                    onChange={() => setFormData({ ...formData, category_id: category.id })}
                    className={`form-radio text-blue-600 ${
                errors.phone ?'border-red-500' : 'border-gray-300' }`}
                    />
                    <span className="text-sm text-gray-800">{category.description}</span>
                </label>
                ))}
            </div>
            {/* {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>} */}
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
              Active collaborator
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
              Add Collaborator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCollaboratorForm;