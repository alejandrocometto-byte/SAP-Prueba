import React, { useState } from 'react';
import { PlusCircle, Trash2, Edit, Check, X } from 'lucide-react';

interface Item {
  id: number;
  name: string;
}

interface EditableListProps {
  title: string;
  items: Item[];
  onAddItem: (name: string) => void;
  onDeleteItem: (id: number) => void;
  onUpdateItem: (id: number, newName: string) => void;
}

const EditableList: React.FC<EditableListProps> = ({ title, items, onAddItem, onDeleteItem, onUpdateItem }) => {
  const [newItemName, setNewItemName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      onAddItem(newItemName.trim());
      setNewItemName('');
    }
  };

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setEditingText(item.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleSaveEdit = (id: number) => {
    if (editingText.trim()) {
      onUpdateItem(id, editingText.trim());
      handleCancelEdit();
    }
  };


  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      
      <form onSubmit={handleAddItem} className="flex items-center space-x-2 mb-4">
        <input 
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Nuevo item..."
          className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-electric-blue"
        />
        <button type="submit" className="p-2 text-white bg-electric-blue rounded-lg hover:bg-blue-600 transition-colors">
          <PlusCircle size={20} />
        </button>
      </form>
      
      <ul className="space-y-2 max-h-48 overflow-y-auto">
        {items.map(item => (
          <li key={item.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
            {editingId === item.id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="bg-gray-600 text-white rounded-md px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-electric-blue"
                autoFocus
              />
            ) : (
              <span className="text-gray-200">{item.name}</span>
            )}
            
            <div className="flex items-center space-x-2 ml-2">
                {editingId === item.id ? (
                    <>
                        <button onClick={() => handleSaveEdit(item.id)} className="text-lime-green hover:text-green-400"><Check size={16} /></button>
                        <button onClick={handleCancelEdit} className="text-coral-red hover:text-red-400"><X size={16} /></button>
                    </>
                ) : (
                    <>
                       {onUpdateItem && <button onClick={() => handleEdit(item)} className="text-gray-400 hover:text-electric-blue"><Edit size={16} /></button>}
                       <button onClick={() => onDeleteItem(item.id)} className="text-gray-400 hover:text-coral-red"><Trash2 size={16} /></button>
                    </>
                )}
            </div>
          </li>
        ))}
         {items.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No hay items.</p>}
      </ul>
    </div>
  );
};

export default EditableList;