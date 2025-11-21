import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Profiles from './pages/Profiles';
import ProfileDetail from './pages/ProfileDetail';
import Messages from './pages/Messages';
import Subscriptions from './pages/Subscriptions';
import Settings from './pages/Settings';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ContentManagement from './pages/ContentManagement';
import Games from './pages/Games'; 
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
                <Route path="/games" element={<Games />} /> 
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/profile/:id" element={<ProfileDetail />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/content-management" element={<ContentManagement />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;