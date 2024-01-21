import React from 'react';
import Nav from './components/Nav';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Chat from   './components/Chat';
import ChatHistory from   './components/ChatHistory';
import Login from   './components/Login';
import Register from   './components/Register';
import UserProfile from   './components/UserProfile';
import { TodoProvider } from './contexts/TodoContext';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';

function App() {
  return (
    <div class="container">
      <AuthProvider>
        <TodoProvider>
          <Router>
            <Nav />
            <h1>Polywise</h1>
            <Routes>
              <Route exact path="/" element={<TodoList />}/>
              <Route exact path="/chat" element={<Chat />}/>
              <Route path="/add-todo" element={<TodoForm />}/>
              <Route path="/chat-history" element={<ChatHistory />}/>
              <Route path="/login" element={<Login />}/>
              <Route path='/register' element={<Register />}/>
              <Route path="/user-profile" element={<UserProfile />}/>
              {/* Add more routes as needed */}
            </Routes>
          </Router>
        </TodoProvider>
      </AuthProvider>
    </div>
  );
}

export default App;