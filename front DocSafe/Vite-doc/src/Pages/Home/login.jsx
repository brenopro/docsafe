import { BrowserRouter } from 'react-router'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'
import './style.css'

function Login() {
    const navigate = useNavigate();

    function mudarCad() {
        navigate('/Home');
    }


    const inputEmail = useRef()
    const inputSenha = useRef()

    async function authentic() {
        try {
            const response = await api.post('/usuarios/mk', {
                email: inputEmail.current.value,
                senha: inputSenha.current.value,
            });

            // Verifica se login foi bem-sucedido (ajuste conforme seu backend)
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('usuario', JSON.stringify(response.data.usuario)); // Corrigido aqui
                navigate('/acesso');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Falha no login. Verifique suas credenciais.');
        }
    }

    return (
        <div class="container">
            <div class="form-wrapper" id="formWrapper">
                <div class="form">
                    <h2>Login</h2>
                    <input type="email" placeholder="Email" ref={inputEmail} required />
                    <input type="password" placeholder="Senha" ref={inputSenha} required />
                    <button onClick={authentic}>Entrar</button>
                    <div class="toggle">
                        <p>Não tem conta? <button onClick={mudarCad}>Cadastrar</button></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;