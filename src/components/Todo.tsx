import React, { useState, useEffect } from 'react';

interface TodoItem {
  id: string;
  name: string;
  time: string;
  dueDate: string; // New field for due date
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  category: string; // New field for category
}

const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    const savedTodos = localStorage.getItem('todoResult');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [todoInput, setTodoInput] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(''); // State for due date
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [category, setCategory] = useState<string>('General'); // State for category
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Pending'>('All');
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('todoResult', JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoInput.trim()) return;

    const hour = String(new Date().getHours()).padStart(2, '0');
    const minute = String(new Date().getMinutes()).padStart(2, '0');
    const second = String(new Date().getSeconds()).padStart(2, '0');

    if (isEditing && editId) {
      const updatedTodos = todos.map((todo) => {
        if (todo.id === editId) {
          return { ...todo, name: todoInput, time: `${hour}:${minute}:${second}`, priority, dueDate, category };
        }
        return todo;
      });
      setTodos(updatedTodos);
      setIsEditing(false);
      setEditId(null);
    } else {
      const newTodo: TodoItem = {
        id: String(todos.length + 1),
        name: todoInput.trim(),
        time: `${hour}:${minute}:${second}`,
        dueDate, // Set due date
        priority,
        completed: false,
        category, // Set category
      };
      setTodos([...todos, newTodo]);
    }

    setTodoInput('');
    setDueDate(''); // Reset due date after adding
    setPriority('Low'); // Reset priority to default after adding
    setCategory('General'); // Reset category to default after adding
  };

  const handleDelete = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  const handleEdit = (id: string) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (todoToEdit) {
      setTodoInput(todoToEdit.name);
      setPriority(todoToEdit.priority);
      setDueDate(todoToEdit.dueDate); // Set due date for editing
      setCategory(todoToEdit.category); // Set category for editing
      setIsEditing(true);
      setEditId(id);
    }
  };

  const handleToggleComplete = (id: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'Completed') return todo.completed;
    if (filter === 'Pending') return !todo.completed;
    return true;
  }).filter(todo => {
    return todo.name.toLowerCase().includes(searchTerm.toLowerCase()); // Search functionality
  });

  return (
    <div className="max-w-[1000px] mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-4">Todo List</h1>
      
      <form id="form" onSubmit={handleSubmit} className="flex mb-4">
        <input
          id="todo"
          type="text"
          value={todoInput}
          onChange={(e) => setTodoInput(e.target.value)}
          placeholder="New task"
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500"
        />
        
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-md mx-2"
        />

        <select
          className="p-2 border border-gray-300 rounded-md mx-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select
          className="p-2 border border-gray-300 rounded-md mx-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="School">School</option>
        </select>

        <button className='bg-blue-500 text-white rounded-r-md px-4 hover:bg-blue-600' type="submit">
          {isEditing ? 'Update' : 'Add'}
        </button>
      </form>

      <input
        type="text"
        placeholder="Search tasks..."
        className="p-2 border border-gray-300 rounded mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="flex justify-between mb-4">
        <button
          className={`px-4 py-2 rounded ${filter === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('All')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'Completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('Completed')}
        >
          Completed
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'Pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('Pending')}
        >
          Pending
        </button>
      </div>

      <div id="wrapper" className="todo-list">
        {filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <div className={`flex justify-between items-center bg-white p-4 mb-2 rounded-md shadow ${todo.completed ? 'line-through' : ''}`} key={todo.id}>
              <div className="flex-grow">
                <p className="text-gray-500 text-sm">ID: {todo.id}</p>
                <h3 className="text-lg font-semibold">{todo.name} - <span className={`font-medium ${todo.priority === 'High' ? 'text-red-500' : todo.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`}>{todo.priority}</span></h3>
                <strong className="text-gray-600 text-sm">Due: {todo.dueDate} | Time: {todo.time}</strong> {/* Display due date */}
                <strong className="text-gray-600 text-sm">Category: {todo.category}</strong> {/* Display category */}
              </div>
              <div className='flex space-x-2'>
                <button className={`bg-green-500 text-white rounded px-3 hover:bg-green-600`} onClick={() => handleToggleComplete(todo.id)}>
                  {todo.completed ? 'Undo' : 'Complete'}
                </button>
                <button className={`bg-yellow-500 text-white rounded px-3 hover:bg-yellow-600`} onClick={() => handleEdit(todo.id)}>Edit</button>
                <button className={`bg-red-500 text-white rounded px-3 hover:bg-red-600`} onClick={() => handleDelete(todo.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default Todo;