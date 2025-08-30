import { useEffect, useState } from "react";
import axios from "axios";

function Projetos() {
  const [projetosList, setProjetosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("https://geomind-service-production.up.railway.app/api/v1/projetos");
        console.log("Dados de projetos recebidos:", response.data); // Debug
        setProjetosList(response.data);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
        setError("Erro ao carregar projetos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjetos();
  }, []);

  if (loading) {
    return (
      <tr>
        <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
          Carregando projetos...
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
      {projetosList.map((projeto, index) => ( 
        <tr key={index}>
          <td>{projeto.nome || 'N/A'}</td>
          <td>{projeto.cliente || 'N/A'}</td>
          <td> 
            <span style={{
              background: projeto.status === 'concluido' ? '#dcfce7' : projeto.status === 'em_andamento' ? '#fef3c7' : '#fee2e2',
              color: projeto.status === 'concluido' ? '#166534' : projeto.status === 'em_andamento' ? '#92400e' : '#dc2626',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {projeto.status}
            </span>
          </td>
          <td>
            <button 
              onClick={() => console.log('Editar projeto:', projeto.id)}
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

export default Projetos;