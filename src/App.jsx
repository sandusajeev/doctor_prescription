
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import PreviewPage from './pages/PreviewPage'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/dashborad' element={<Dashboard/>} />
        <Route path='/preview' element={<PreviewPage />} />
      </Routes>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
