import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';
import authService from '../services/authService';

function Orcamentos() {
  const [orcamentosList, setOrcamentosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrcamentos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Verificar se está autenticado
        if (!authService.isAuthenticated()) {
          setError("Usuário não autenticado");
          return;
        }
        
        const response = await axios.get(API_ENDPOINTS.orcamentos.base, {
          headers: getAuthHeaders()
        });
        
        console.log("Dados recebidos:", response.data); // Debug
        
        // Verificar se a resposta tem o formato esperado
        if (response.data.success) {
          setOrcamentosList(response.data.data || []);
        } else {
          setOrcamentosList(response.data || []);
        }
      } catch (error) {
        console.error("Erro ao buscar orçamentos:", error);
        if (error.response?.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
        } else {
          setError("Erro ao carregar orçamentos. Tente novamente mais tarde.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrcamentos();
  }, []);

  if (loading) {
    return (
      <tr>
        <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
          Carregando orçamentos...
        </td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr>
        <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#dc2626' }}>
          {error}
        </td>
      </tr>
    );
  }

  return (
    <>
      {orcamentosList.map((orcamento, index) => ( 
        <tr key={index}>
          <td>{orcamento.email}</td>
          <td> 
            <span style={{
              background: orcamento.status === 'aprovado' ? '#dcfce7' : orcamento.status === 'pendente' ? '#fef3c7' : '#fee2e2',
              color: orcamento.status === 'aprovado' ? '#166534' : orcamento.status === 'pendente' ? '#92400e' : '#dc2626',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {orcamento.status}
            </span>
          </td>
          <td>
            <button 
              onClick={() => console.log('Editar orçamento:', orcamento.id)}
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

export default Orcamentos;