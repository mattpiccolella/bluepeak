import React from 'react';
import Nav from './components/Nav';
import Chat from   './components/Chat';
import ChatHistory from   './components/ChatHistory';
import Login from   './components/Login';
import Register from   './components/Register';
import UserProfile from   './components/UserProfile';
import FileManager from './components/FileManager';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './assets/styles/App.css';

function App() {
  return (
    <div class="container">
      <AuthProvider>
        <Router>
          <Nav />
          <Routes>
            <Route exact path="/" element={<ChatHistory />}/>
            <Route exact path="/chat" element={<Chat />}/>
            <Route path="/chat/:id" element={<Chat />}/>
            <Route path="/login" element={<Login />}/>
            <Route path='/register' element={<Register />}/>
            <Route path="/user-profile" element={<UserProfile />}/>
            <Route path="/documents" element={<FileManager />}/>
            {/* Add more routes as needed */}
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;