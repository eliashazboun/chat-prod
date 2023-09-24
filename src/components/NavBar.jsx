import { Outlet } from 'react-router-dom'
import logo from '../assets/logochat.png'
import Footer from './Footer'
import { useNavigate } from 'react-router-dom'
import { createContext } from 'react';

export const timeLoaded = createContext();

const NavBar = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/')
  }
  return (
    <div className='nav '>
      <div className="wrap bg-orange-100 shadow-lg w-full mb-2">
        <div onClick={handleClick} className="logo text-center">
          <img src={logo} height={80} alt="logo"  />
        </div>
      </div>
      <timeLoaded.Provider value={Date.now()}>
      <Outlet/>
      </timeLoaded.Provider>
      <Footer/>
    </div>
  )
}

export default NavBar