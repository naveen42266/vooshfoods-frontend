import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

interface AddTodoFormProps {
  addTodo: (todo: Todo) => void;
  content: string;
  handleEmitCancel: (value: boolean) => void;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  dueDate?: string;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ addTodo, content, handleEmitCancel }) => {
  const { register, handleSubmit, reset } = useForm<{ text: string }>(); // Removed `errors`
  const [category, setCategory] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const categories = ['work', 'personal', 'shopping', 'education', 'health', 'finance', 'hobbies'];

  const onSubmit = (data: { text: string }) => {
    const newTodo: Todo = {
      id: uuidv4(),
      text: data.text,
      completed: false,
      category,
      dueDate,
    };
    addTodo(newTodo);
    reset();
    setCategory('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 bg-white p-2 md:p-4 rounded shadow-md ${content === 'right' && 'h-screen relative'}`}>
      <input
        type="text"
        placeholder="Add todo"
        {...register('text', { required: true })}
        className="w-full p-2 border rounded-md"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded-md capitalize"
      >
        <option value="">Select Category</option>
        {/* Add options for categories */}
        {/* <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="shopping">Shopping</option> */}
        {categories?.map((each) => (
          <option value={each} className='capitalize'>{each}</option>
        ))}
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      <button
        type="submit"
        className={`w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors duration-300 ${content === 'right' && 'absolute bottom-0 right-0 left-0 rounded-none'}`}
      >
        Add Todo
      </button>
    </form>
  );
};

export default AddTodoForm;
