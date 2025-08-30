import { useEffect, useState } from "react";
import axios from "axios";

function Clientes() {
  const [clientesList, setClientesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("https://geomind-service-production.up.railway.app/api/v1/clientes");
        setClientesList(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        setError("Erro ao carregar clientes. Tente novamente mais tarde.");
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
              onClick={() => console.log('Editar cliente:', cliente.id)}
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

export default Clientes;










