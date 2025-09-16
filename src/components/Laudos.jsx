import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from '../config/api';

function Laudos() {
  const [laudosList, setLaudosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLaudos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(API_ENDPOINTS.laudos.base);
        console.log("Dados de laudos recebidos:", response.data); // Debug
        setLaudosList(response.data);
      } catch (error) {
        console.error("Erro ao buscar laudos:", error);
        setError("Erro ao carregar laudos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchLaudos();
  }, []);

  if (loading) {
    return (
      <tr>
        <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
          Carregando laudos...
        </td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr>
        <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#dc2626' }}>
          {error}
        </td>
      </tr>
    );
  }

  return (
    <>
      {laudosList.map((laudo, index) => ( 
        <tr key={index}>
          <td>{laudo.numero || 'N/A'}</td>
          <td>{laudo.cliente || 'N/A'}</td>
          <td> 
            <span style={{
              background: laudo.status === 'emitido' ? '#dcfce7' : laudo.status === 'em_elaboracao' ? '#fef3c7' : '#fee2e2',
              color: laudo.status === 'emitido' ? '#166534' : laudo.status === 'em_elaboracao' ? '#92400e' : '#dc2626',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {laudo.status}
            </span>
          </td>
          <td>
            <button 
              onClick={() => console.log('Editar laudo:', laudo.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#059669',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
            >
              Editar
            </button>
          </td>
        </tr> 
      ))}
    </>
  );
}

export default Laudos;