import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Signup from './components/Signup'
import NotFound from './components/NotFound'
import Login from './components/Login'
import LayoutApp from './components/app/LayoutApp'
import Dashboard from './components/app/Dashboard'
import Customers from './components/app/customers'
import Logs from './components/app/Logs'
import { Toaster } from 'react-hot-toast';


const App=() => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/app' element={<LayoutApp />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='customers' element={<Customers />} />
          <Route path='logs' element={<Logs />} />
        </Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </>


  )
}

export default App