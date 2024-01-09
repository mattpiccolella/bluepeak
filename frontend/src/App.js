import React from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { TodoProvider } from './contexts/TodoContext';
import './assets/styles/App.css';

function App() {
  return (
    <TodoProvider>
      <div className="App">
        <h1>My Todo List</h1>
        <TodoForm />
        <TodoList />
      </div>
    </TodoProvider>
  );
}

export default App;