import React, { useState, useContext } from 'react';
import { TodoContext } from '../contexts/TodoContext';

function TodoForm() {
  const [text, setText] = useState('');
  const { dispatch } = useContext(TodoContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text) {
        debugger;
        dispatch({ type: 'ADD_TODO', payload: text });
        setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TodoForm;