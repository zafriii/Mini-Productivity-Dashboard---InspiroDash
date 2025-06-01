import { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import RegForm from './components/RegForm';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Goal from './components/Goal';
import Footer from './components/Footer';
import './App.css';

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage for saved theme or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const toggleTheme = () => {
    setTheme((curr) => {
      const newTheme = curr === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app" data-theme={theme}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/tasks' element={<Dashboard/>} />
            <Route path='/goals' element={<Goal/>} />
            <Route path='/login' element={<LoginForm/>} />
            <Route path='/registration' element={<RegForm/>} />
          </Routes>
          <Footer/>
        </BrowserRouter>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
