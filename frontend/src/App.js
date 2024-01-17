import React from 'react';
import Nav from './components/Nav';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Chat from   './components/Chat';
import { TodoProvider } from './contexts/TodoContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';

function App() {
  return (
    <TodoProvider>
      <Router>
        <Nav />
        <Routes>
          <Route exact path="/" element={<TodoList />}/>
          <Route path="/add-todo" element={<TodoForm />}/>
          {/* Add more routes as needed */}
        </Routes>
        <Chat />
      </Router>
    </TodoProvider>
  );
}

export default App;