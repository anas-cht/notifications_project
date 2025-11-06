import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Mail, Phone, VerifiedIcon, Trash2 } from 'lucide-react';
import AddCollaboratorForm from '../components/Forms/AddCollaboratorForm.tsx';
import EditCollaboratorForm from '../components/Forms/EditCollaboratorForm';
import { allCollaborator, statusChange } from '../services/CollaboratorService.tsx';
import { allCategory } from '../services/CategoryService';
import { useLocation } from "react-router-dom";

export interface Collaborator {
  id: string;
  email: string;
  email2: string;
  fullName: string;
  phoneNumber: string;
  isActive: boolean;
  category_id: number |undefined ;
}

export interface Category {
  id: number;
  description: string;
}

function Collaborators() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const location = useLocation();

  const fetchCollaborators = useCallback(async () => {
    try {
      const response = await allCollaborator();
      setCollaborators(response.data);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await allCategory();
      setCategories(response.data);
      localStorage.setItem('categories', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      await fetchCollaborators();
      if (location.state?.openAddForm) {
        setShowAddForm(true);
      }
    };
    fetchData();
  }, [location.state, fetchCategories, fetchCollaborators]);

  const filteredCollaborators = collaborators.filter(
    (collaborator) =>
      collaborator.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collaborator.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCollaborator = (newCollaborator: Collaborator) => {
    setCollaborators([...collaborators, newCollaborator]);
  };

  const handleEditCollaborator = (updatedCollaborator: Collaborator) => {
    setCollaborators(collaborators.map(c => 
      c.id === updatedCollaborator.id ? updatedCollaborator : c
    ));
  };

  const openEditForm = (collaborator: Collaborator) => {
    setSelectedCollaborator(collaborator);
    setShowEditForm(true);
  };

  const handleDisable = async (id: string) => {
    try {
      await statusChange(id);
      fetchCollaborators();
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collaborators</h1>
          <p className="text-gray-600 mt-2">Manage your platform users</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Collaborator
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search collaborators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Collaborators List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Collaborators List</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {filteredCollaborators.map((collaborator) => {
              const category = categories.find(c => c.id === collaborator.category_id);

              return (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {collaborator.fullName ? collaborator.fullName[0].toUpperCase() : collaborator.email[0].toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-medium">
                        {collaborator.email}
                        <span
                          className={`ml-2 px-2 py-1 text-sm rounded-full ${
                            collaborator.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {collaborator.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </h3>

                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Mail className="h-3 w-3" />
                        <span>{collaborator.email2}</span>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Phone className="h-3 w-3" />
                        <span>{collaborator.phoneNumber}</span>
                      </div>

                      {/* Category */}
                      {category && (
                        <h3 className="font-medium text-sm text-gray-700 mt-2">
                          Category: {category.description}
                        </h3>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => openEditForm(collaborator)}
                      className="w-32 border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 flex items-center justify-center"
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDisable(collaborator.id)}
                      className={`w-32 border px-3 py-1 rounded text-sm flex items-center justify-center ${
                        collaborator.isActive
                          ? 'border-red-300 text-red-600 hover:bg-red-50'
                          : 'border-green-300 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {collaborator.isActive ? (
                        <>
                          <Trash2 className="mr-1 h-3 w-3" />
                          Disable
                        </>
                      ) : (
                        <>
                          <VerifiedIcon className="mr-1 h-3 w-3" />
                          Enable
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Collaborator Form */}
      <AddCollaboratorForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdd={handleAddCollaborator}
      />

      {/* Edit Collaborator Form */}
      <EditCollaboratorForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onEdit={handleEditCollaborator}
        collaborator={selectedCollaborator}
      />
    </div>
  );
}

export default Collaborators;
