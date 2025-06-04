import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'

import Home from './Pages/Home'; // Assumindo que Home.jsx ou Home/index.jsx exporta o componente Home
import Login from './Pages/Home/login'; // Assumindo que Login.jsx exporta o componente Login
import Acesso from './Pages/Home/acesso'; // Assumindo que acesso.jsx exporta o componente Acesso
import Fotos from './Pages/Home/fotos';
const router = createBrowserRouter([
  {
    path: "/Home",
    element: <Home />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Acesso",
    element: <Acesso />,
  },
  {
    path: "/Fotos",
    element: <Fotos />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
