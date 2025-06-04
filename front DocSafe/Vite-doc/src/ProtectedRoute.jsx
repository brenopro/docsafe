import React from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Usando Outlet para rotas aninhadas, se necessário

const PrivateRoute = () => {
    const token = localStorage.getItem('token'); // Pega o token do localStorage

    // Se autorizado, retorna um Outlet que renderizará os elementos filhos
    // Se não, retorna um elemento que navegará para a página de login
    return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;