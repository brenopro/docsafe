
import './acesso.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function Acesso() {
    const navigate = useNavigate();
    const inputImagem = useRef();
    const [preview, setPreview] = useState(null);
    const [abaAtiva, setAbaAtiva] = useState('inicio'); // 'inicio' ou 'fotos'
    const [fotosUsuario, setFotosUsuario] = useState([]);

    // Verifica autenticação e carrega fotos se necessário
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');

        if (abaAtiva === 'fotos') {
            carregarFotosUsuario();
        }
    }, [abaAtiva, navigate]);

    async function carregarFotosUsuario() {
    try {
        const response = await api.get('/fotos', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.data.error === false) {
            setFotosUsuario(response.data.fotos); // Usa response.data.fotos
        } else {
            alert(response.data.mensagem || "Erro ao carregar fotos.");
        }
    } catch (error) {
        console.error("Erro ao carregar fotos:", error);
        alert("Token expirado ou acesso negado.");
        navigate('/login'); // Redireciona se o token for inválido
    }
}

    function handleSelecionarImagem(e) {
        const arquivo = e.target.files[0];
        if (arquivo) {
            setPreview(URL.createObjectURL(arquivo));
        }
    }

    async function handleUpload() {
        const file = inputImagem.current.files[0];
        if (!file) return alert("Selecione uma imagem primeiro.");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                alert("Imagem enviada com sucesso!");
                setPreview(null);
                inputImagem.current.value = '';
                if (abaAtiva === 'fotos') {
                    carregarFotosUsuario(); // Atualiza a lista após upload
                }
            }
        } catch (error) {
            console.error("Erro ao fazer upload:", error);
            alert("Erro ao enviar a imagem.");
        }
    }

    // Renderização condicional do conteúdo
    function renderizarConteudo() {
        switch (abaAtiva) {
            case 'inicio':
                return (
                    <>
                        <h1>Adicionar Documento</h1>
                        <label className="upload-box" htmlFor="fileInput">
                            {preview ? (
                                <img src={preview} alt="Pré-visualização" />
                            ) : (
                                <span>Clique para selecionar uma imagem</span>
                            )}
                        </label>
                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            ref={inputImagem}
                            onChange={handleSelecionarImagem}
                            style={{ display: 'none' }}
                        />
                        {preview && (
                            <button className="upload-btn" onClick={handleUpload}>
                                Enviar
                            </button>
                        )}
                    </>
                );
            case 'fotos':
                return (
                    <>
                        <h1>Documentos</h1>
                        <div className="fotos-grid">
                            {fotosUsuario.length > 0 ? (
                                fotosUsuario.map((foto) => (
                                    <img
                                        key={foto.id}
                                        src={foto.url}
                                        alt={`Foto ${foto.id}`}
                                        className="foto-item"
                                    />
                                ))
                            ) : (
                                <p>Nenhuma foto encontrada.</p>
                            )}
                        </div>
                    </>
                );
            default:
                return null;
        }
    }

    return (
        <div className="layout">
            <aside className="sidebar">
                <h2>Docsafe</h2>
                <ul>
                    <li 
                        onClick={() => setAbaAtiva('inicio')}
                        className={abaAtiva === 'inicio' ? 'active' : ''}
                    >
                        🏠 Início
                    </li>
                    <li 
                        onClick={() => setAbaAtiva('fotos')}
                        className={abaAtiva === 'fotos' ? 'active' : ''}
                    >
                        📷 Fotos
                    </li>
                    <li>⚙️ Configurações</li>
                </ul>
            </aside>

            <main className="upload-content">
                {renderizarConteudo()}
            </main>
        </div>
    );
}

export default Acesso;
































// abaixo o codigo antigo
//     return (
//         <>

//             <div className="layout">
//                 <header className="header">Docsafe</header>

//                 <div className="main-container">
//                     <aside className="sidebar">
//                         <ul>
//                             <li>Início</li>
//                             <li>Fotos</li>
//                             <li>Configurações</li>
//                         </ul>
//                     </aside>

//                     <main className="content">
//                         <h2>Adicionar Fotos</h2>
//                         <label htmlFor="fileInput" className="add-button">
//                             + Adicionar Foto
//                         </label>
//                         <input type="file" id="fileInput" accept="image/*" style={{ display: 'none' }} />
//                     </main>
//                 </div>

//                 <footer className="footer">© 2025 Docsafe</footer>
//             </div>
//         </>
//     );
// }

// export default Acesso;
