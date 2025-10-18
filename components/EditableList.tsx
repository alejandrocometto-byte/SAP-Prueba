import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';

interface Item {
  id: number;
  name: string;
}

interface EditableListProps {
  title: string;
  items: Item[];
  onAddItem: (name: string) => void;
  onUpdateItem: (id: number, newName: string) => void;
  onDeleteItem: (id: number) => void;
  requestAuth: (action: () => void) => void;
}

const EditableList: React.FC<EditableListProps> = ({ title, items, onAddItem, onUpdateItem, onDeleteItem, requestAuth }) => {
  const [newItemName, setNewItemName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAdd = () => {
    if (newItemName.trim()) {
      requestAuth(() => {
        onAddItem(newItemName.trim());
        setNewItemName('');
      });
    }
  };
  
  const startEditing = (item: Item) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };
  
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };
  
  const handleUpdate = () => {
    if (editingId && editingName.trim()) {
      requestAuth(() => {
        onUpdateItem(editingId, editingName.trim());
        cancelEditing();
      });
    }
  };

  const handleDelete = (id: number) => {
    requestAuth(() => {
      onDeleteItem(id);
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col h-full">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="flex-grow overflow-y-auto pr-2 min-h-[150px] max-h-[300px]">
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
              {editingId === item.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUpdate()}
                  className="bg-gray-600 text-white rounded px-2 py-1 w-full mr-2 focus:outline-none focus:ring-1 focus:ring-electric-blue"
                  autoFocus
                />
              ) : (
                <span className="text-gray-300 break-all">{item.name}</span>
              )}

              <div className="flex items-center space-x-2">
                {editingId === item.id ? (
                  <>
                    <button onClick={handleUpdate} className="text-lime-green hover:text-green-400"><Check size={16} /></button>
                    <button onClick={cancelEditing} className="text-gray-400 hover:text-white"><X size={16} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(item)} className="text-gray-400 hover:text-white"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-coral-red hover:text-red-400"><Trash2 size={16} /></button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex space-x-2 border-t border-gray-700 pt-4">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nuevo item..."
          className="bg-gray-700 text-white rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-electric-blue"
        />
        <button
          onClick={handleAdd}
          className="bg-electric-blue text-white p-2 rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

export default EditableList;
