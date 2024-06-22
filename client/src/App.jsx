import { useId, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './components/home/Home'
import Navbar from './components/navbar/Navbar'
import Product from './components/home/Product'
import Profile from './components/home/Profile'
import Orders from './components/home/Orders'
import Rewards from './components/home/Rewards'
import Payment from './components/home/Payment';
import AuthForm from './components/User/AuthForm';
import { jwtDecode } from 'jwt-decode';
import Saved from './components/home/Saved';
import Seach from './components/home/Seach';


function App() {
  const id = useId()
  const api = import.meta.env.VITE_API_URL;
  const [token, setToken] = useState(localStorage.getItem("token") || '');

  const checkLogin = async () => {
    let result = await fetch(`${api}user/isLoggedIn`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
    result = await result.json()
    return result
  }

  useEffect(() => {
    if (localStorage.length > 0) {
      if (localStorage.getItem('isLogin'))
        if (token != '') {
          checkLogin().then((res) => {
            if (res.success)
              if (jwtDecode(token || '').exp < Date.now() / 1000) {
                localStorage.clear()
              }
              else {
                localStorage.setItem('token', token);
                localStorage.setItem('isLogin', 'true');
              }
            else {
              localStorage.clear()
            }
          })
        } else {
          localStorage.clear()
        }
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className='app'>
      <Navbar />
      <>
        <Routes>
          <Route path="/" element={<Home key={id} />} />
          <Route path="/product/*" element={<Product key={id} />} />
          <Route path="/profile/:profileId" element={<Profile key={id} />} />
          <Route path="/Orders" element={<Orders key={id} />} />
          <Route path="/Rewards" element={<Rewards key={id} />} />
          <Route path='/login' element={<AuthForm login={true} />} />
          <Route path='/signup' element={<AuthForm login={false} />} />
          <Route path='/payment' element={<Payment key={id} />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/search" element={<Seach />} />
        </Routes>
      </>
    </div>
  )
}

export default App
