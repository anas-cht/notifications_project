import { useState,useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2,Mail,Users,Search, VerifiedIcon} from 'lucide-react';
// import { Module } from '../types';
import AddModuleForm from '../components/Forms/AddCatgoryForm';
import { allCategory, changeStatus} from '../services/CategoryService';
import { useLocation } from "react-router-dom";
import EditModuleForm from '../components/Forms/EditCategoryForm'
import { allCollaborator } from '../services/CollaboratorService';

export interface Category {
    id?: number;
    name: string;
    description: string;
    isActive: boolean;
    collaborators_count:number;
    notifications_count:number;
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

function Category() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedModule,setSelectedModule] = useState<Category | null>(null);
    const [categorys, setCategorys] = useState<Category[]>([]);
    const [collaborators,setCollaborators]=useState<Collaborator[]>([]);
    const location = useLocation();

     const fetchCategories = useCallback(async () => {
        try {
          const response = await allCategory();
          setCategorys(response.data);
          setCollaborators((await allCollaborator()).data);
          
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      }, []);
    
      useEffect(() => {
        fetchCategories();
        if (location.state?.openAddForm) {
          setShowAddForm(true);
        }
      }, [location.state, fetchCategories]);


  const filteredCategorys = categorys.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = (newCategory: Category) => {
    setCategorys([...categorys, newCategory]);
  };

  const handleDisable = async (id?:number) => {
    try {
      const response=await changeStatus(id);
      console.log(`Category  disabled:`,response.data);
      await fetchCategories();
      // Optionally: refresh data
    } catch (error) {
      console.error("Error disabling category", error);
    }
  };


  const handleEditModule = (updatedModule: Category) => {
    setCategorys(categorys.map(m => 
      m.id === updatedModule.id ? updatedModule : m
    ));
  };


  const openEditForm = (module: Category) => {
    setSelectedModule(module);
    setShowEditForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modules</h1>
          <p className="text-gray-600 mt-2">
            Manage your thematic modules and their configurations
          </p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </button>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategorys.map((module) => (
          <div key={module.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {/* <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: module.color }}
                ></div> */}
                <h3 className="text-lg font-semibold">{module.description}</h3>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                module.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-red-500'
              }`}>
                {module.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{module.name}</p>

            <div className="flex gap-6 mb-3">
                <div className="flex items-center">
                    <Users className="mr-2 text-orange-600 h-6 w-6" />
                    {module.collaborators_count} collaborators
                </div>
                <div className="flex items-center">
                    <Mail className="mr-2 text-green-600 h-6 w-6" />
                    {module.notifications_count} notifications
                </div>
            </div>
            
            {/* <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                {module.collaborators.length} collaborators
              </div>
              <div className="flex items-center">
                <Bell className="mr-1 h-4 w-4" />
                {module.notificationRules.length} rules
              </div>
            </div> */}

            <div className="flex items-center justify-center space-x-2">
              <button onClick={()=>openEditForm(module)}
              className="w-40 border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 flex items-center justify-center">
                <Edit className="mr-1 h-3 w-3" />
                Edit
              </button>
              <button 
                    onClick={() => handleDisable(module.id)}
                    className={`w-40 border px-3 py-1 rounded text-sm hover:bg-red-50 flex items-center justify-center${
                     module.isActive 
                            ? 'border-red-300 text-red-600'
                            : 'border-green-300 text-green-600' 
                        }`}
                    >
                    <span
                        className={`flex items-center`}>
                        {module.isActive ? (
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
                    </span>
                </button>

            </div>
          </div>
        ))}
      </div>

      <AddModuleForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAdd={handleAddCategory}
        collaborators={collaborators}
      />

        <EditModuleForm
                isOpen={showEditForm}
                onClose={() => setShowEditForm(false)}
                onEdit={handleEditModule}
                category={selectedModule}
            />
    </div>
  );
}

export default Category;