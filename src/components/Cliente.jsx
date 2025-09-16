import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';
import authService from '../services/authService';
import EditarCliente from './EditarCliente';

function Clientes() {
  const [clientesList, setClientesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Verificar se está autenticado
        if (!authService.isAuthenticated()) {
          setError("Usuário não autenticado");
          return;
        }
        
        const response = await axios.get(API_ENDPOINTS.clientes.base, {
          headers: getAuthHeaders()
        });
        
        console.log("Dados recebidos:", response.data); // Debug
        
        // Verificar se a resposta tem o formato esperado
        if (response.data.success) {
          setClientesList(response.data.data || []);
        } else {
          setClientesList(response.data || []);
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        if (error.response?.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
        } else {
          setError("Erro ao carregar clientes. Tente novamente mais tarde.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) {
    return (
      <tr>
        <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
          Carregando clientes...
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
      {clientesList.map((cliente, index) => ( 
        <tr key={index}>
          <td>{cliente.nome || 'N/A'}</td>
          <td>{cliente.email}</td>
          <td> 
            <span style={{
              background: cliente.status === 'ativo' ? '#dcfce7' : '#fef3c7',
              color: cliente.status === 'ativo' ? '#166534' : '#92400e',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              {cliente.status}
            </span>
          </td>
          <td>
            <button 
              onClick={() => {
                setClienteParaEditar(cliente);
                setEditModalOpen(true);
              }}
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
      
      <EditarCliente
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setClienteParaEditar(null);
        }}
        onSuccess={(clienteAtualizado) => {
          // Atualizar a lista de clientes
          setClientesList(prev => 
            prev.map(cliente => 
              cliente.id === clienteAtualizado.id ? clienteAtualizado : cliente
            )
          );
          setEditModalOpen(false);
          setClienteParaEditar(null);
        }}
        cliente={clienteParaEditar}
      />
    </>
   );
}

export default Clientes;










