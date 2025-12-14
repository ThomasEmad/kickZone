import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
export default function App() {
  return (<BrowserRouter><nav className='nav'>
    <Link to='/'>Home</Link> |
    <Link to='/register'>Register</Link> |
    <Link to='/login'>Login</Link></nav>
    <div className='container'><Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
    </Routes></div>
  </BrowserRouter>)
}
