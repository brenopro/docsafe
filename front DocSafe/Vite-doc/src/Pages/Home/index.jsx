
import { useEffect, useState, useRef } from 'react'
import './style.css'
import { BrowserRouter, RouterProvider, createBrowserRouter } from 'react-router'
import { useNavigate } from 'react-router-dom';
import Lixinho from '../../assets/Lixinho.png'
import api from '../../services/api'




function Home() {

  const navigate = useNavigate();


  const [users, setUsers] = useState([])

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()
  const inputSenha = useRef()
  
  async function getUsers() {
    const usersFromApi = await api.get('/usuarios')
    setUsers(usersFromApi.data)
    console.log(users)
  }

  function mudarLog() {
    navigate('/login');
  }


  async function createUsers() {
  try {
    await api.post('/usuarios', {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value,
      senha: inputSenha.current.value
    });
    alert('Usuário cadastrado com sucesso!');
  } catch (error) {
    alert('Erro ao cadastrar usuário!');
    console.error(error);
  }
}


  async function deleteUsers(id) {
    await api.delete()

  }


  useEffect(() => {
    getUsers()
  }, [])


  return (
    <div class="container">
      <div class="form-wrapper" id="formWrapper">
        <div class="form">
          <h2>Cadastro</h2>
          <input type="text" placeholder="Nome" ref={inputName} required />
          <input type="number" placeholder="Idade" min="1" ref={inputAge} required />
          <input type="email" placeholder="Email" ref={inputEmail} required />
          <input type="password" placeholder="Senha" ref={inputSenha} required />
          <button onClick={createUsers}>Cadastrar</button>
          <div class="toggle">
            <p>Já tem conta?<button onClick={mudarLog}>Entrar</button></p>
          </div>
        </div>
      </div>
    </div>





    // <div className='container'>
    //   <h2>Formulário de Cadastro</h2>
    //   <form>
    //     <input id="nome" placeholder='Nome' type="text" name='Nome' ref={inputName} required />
    //     <input id="idade" placeholder='Idade' type="number" min="1" name='Idade' ref={inputAge} required />
    //     <input id="email" placeholder='Email' type="email" name='Email' ref={inputEmail} required />
    //     <button type="submit" onClick={createUsers}>Cadastrar</button>
    //   </form>
    // </div>
  )
}

export default Home
