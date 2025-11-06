import React, { useState, useMemo } from "react";
import { Plus, X, Bell } from "lucide-react";
import { sendNotification } from "../../services/NotificationService";
// import Collaborators from "../../pages/Collaborators";

interface Category {
  id: number;
  description: string;
}

interface Template {
  id?: number;
  name: string;
}

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
  id: number;
  title: string;
  createdAt?: string;
  sentAt?: string;
  isActive: boolean;
  category_id: number;
  template_id: number;
  recipients?: Collaborator[]; 
}

interface AddNotificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (notification: FormData) => void;
  modules: Category[];
  templates: Template[];
  collaborators: Collaborator[];
}

interface FormErrors {
  title: string;
  category_id: string;
  template_id: string;
}

// ...imports remain the same

function AddNotificationForm({
    isOpen,
    onClose,
    onAdd,
    modules,
    templates,
    collaborators
  }: AddNotificationFormProps) {
    const [formData, setFormData] = useState<FormData>({
      id: 0,
      category_id: 0,
      title: "",
      isActive: false,
      template_id: 0,
      recipients: []
    });
  
    const [errors, setErrors] = useState<FormErrors>({
      category_id: "",
      title: "",
      template_id: ""
    });
  
    const [recipientFilter, setRecipientFilter] = useState("");
  
    const validateForm = (): boolean => {
      const newErrors: FormErrors = { category_id: "", title: "", template_id: "" };
      let isValid = true;
  
    //   if (!formData.category_id) {
    //     newErrors.category_id = "Please select a module";
    //     isValid = false;
    //   }
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
        isValid = false;
      }
      if (!formData.template_id) {
        newErrors.template_id = "Message is required";
        isValid = false;
      }
      if (!formData.recipients || formData.recipients.length === 0) {
        alert("Please select at least one recipient");
        isValid = false;
      }
  
      setErrors(newErrors);
      return isValid;
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;
  
      const response = await sendNotification(formData);
      console.log("Notification created:", response.data);
  
      onAdd({ ...formData });
  
      setFormData({
        id: 0,
        category_id: 0,
        title: "",
        isActive: false,
        template_id: 0,
        recipients: []
      });
      setErrors({ category_id: "", title: "", template_id: "" });
      setRecipientFilter("");
      onClose();
    };
  
    const filteredCollaborators = useMemo(() => {
      return collaborators.filter(c =>
        c.fullName.toLowerCase().includes(recipientFilter.toLowerCase()) ||
        c.email.toLowerCase().includes(recipientFilter.toLowerCase())
      );
    }, [recipientFilter, collaborators]);
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Add New Notification</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Module */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => {
                  const selectedCategoryId = Number(e.target.value);
  
                  // auto-select collaborators in this module
                  const collaboratorsInCategory = collaborators.filter(
                    c => c.category_id === selectedCategoryId
                  );
  
                  setFormData({
                    ...formData,
                    category_id: selectedCategoryId,
                    recipients: collaboratorsInCategory // full entities now
                  });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category_id ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value={0}>Select a category</option>
                {modules.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.description}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
              )}
            </div>
  
            {/* Template */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template
              </label>
              <select
                value={formData.template_id}
                onChange={(e) =>
                  setFormData({ ...formData, template_id: Number(e.target.value) })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.template_id ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value={0}>Select a template</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              {errors.template_id && (
                <p className="mt-1 text-sm text-red-600">{errors.template_id}</p>
              )}
            </div>
  
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter notification title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
  
            {/* Recipients with search + checkboxes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipients
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
  
            {/* Active checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Active Notification
              </label>
            </div>
  
            {/* Buttons */}
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
                Send Notification
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  export default AddNotificationForm;
  