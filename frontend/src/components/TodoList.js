import React, { useContext } from 'react';
import TodoItem from './TodoItem';
import { TodoContext } from '../contexts/TodoContext';

function TodoList() {
  const { todos } = useContext(TodoContext);

  console.log('Todos: ', todos);
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export default TodoList;