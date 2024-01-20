import React from 'react';
import Nav from './components/Nav';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Chat from   './components/Chat';
import ChatHistory from   './components/ChatHistory';
import { TodoProvider } from './contexts/TodoContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';

function App() {
  return (
    <TodoProvider>
      <Router>
        <Nav />
        <h1>Polywise</h1>
        <Routes>
          <Route exact path="/" element={<TodoList />}/>
          <Route exact path="/chat" element={<Chat />}/>
          <Route path="/add-todo" element={<TodoForm />}/>
          <Route path="/chat-history" element={<ChatHistory />}/>
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </TodoProvider>
  );
}

export default App;