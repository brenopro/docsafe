import './fotos.css';
import { useEffect, useState } from 'react';
import api from '../../services/api';

function Fotos() {
    const [fotos, setFotos] = useState([]);

    useEffect(() => {
        async function fetchFotos() {
            try {
                const response = await api.get('/fotos', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setFotos(response.data);
            } catch (error) {
                console.error('Erro ao buscar fotos:', error);
            }
        }

        fetchFotos();
    }, []);

    return (
        <div className="fotos-page">
            <h1>Minhas Fotos</h1>
            <div className="galeria">
                {fotos.map((foto, index) => (
                    <div key={index} className="foto-card">
                        <img src={`http://localhost:3000/${foto}`} alt={`Foto ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Fotos;
