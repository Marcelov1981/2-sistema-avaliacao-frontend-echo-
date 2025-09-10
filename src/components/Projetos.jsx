import { useEffect, useState } from "react";
import axios from "axios";
import EditarProjeto from './EditarProjeto';

function Projetos() {
  const [projetosList, setProjetosList] = useState([]);
  const [clientesList, setClientesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [projetoParaEditar, setProjetoParaEditar] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar projetos e clientes em paralelo
      const [projetosResponse, clientesResponse] = await Promise.all([
        axios.get("https://geomind-service-production.up.railway.app/api/v1/realstate"),
        axios.get("https://geomind-service-production.up.railway.app/api/v1/clientes")
      ]);
      
      console.log("Dados de projetos recebidos:", projetosResponse.data);
      console.log("Dados de clientes recebidos:", clientesResponse.data);
      
      setProjetosList(projetosResponse.data);
      setClientesList(clientesResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setError("Erro ao carregar dados. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Função para buscar nome do cliente pelo ID
  const getClienteNome = (clienteId) => {
    const cliente = clientesList.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  if (loading) {
    return (
      <tr>
        <td colSpan="12" style={{ textAlign: 'center', padding: '20px' }}>
          Carregando dados...
        </td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr>
        <td colSpan="12" style={{ textAlign: 'center', padding: '20px', color: '#dc2626' }}>
          {error}
        </td>
      </tr>
    );
  }

  const handleEditSuccess = () => {
    fetchData(); // Recarrega a lista de projetos
    setEditModalOpen(false);
    setProjetoParaEditar(null);
  };

  return (
    <>
      {projetosList.map((projeto, index) => ( 
        <tr key={index}>
          <td>{projeto.nome || 'N/A'}</td>
          <td>{getClienteNome(projeto.cliente_id)}</td>
          <td>{projeto.tipo_imovel || 'N/A'}</td>
          <td>{projeto.endereco_imovel || 'N/A'}</td>
          <td>{projeto.cidade_imovel || 'N/A'}</td>
          <td>{projeto.estado_imovel || 'N/A'}</td>
          <td>{projeto.cep_imovel || 'N/A'}</td>
          <td>{projeto.area_terreno ? `${projeto.area_terreno} m²` : 'N/A'}</td>
          <td>{projeto.area_construida ? `${projeto.area_construida} m²` : 'N/A'}</td>
          <td>{projeto.finalidade_avaliacao || 'N/A'}</td>
          <td>{projeto.prazo_entrega ? new Date(projeto.prazo_entrega).toLocaleDateString('pt-BR') : 'N/A'}</td>
          <td>
            <button 
              onClick={() => {
                setProjetoParaEditar(projeto);
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
      <EditarProjeto
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setProjetoParaEditar(null);
        }}
        onSuccess={handleEditSuccess}
        projeto={projetoParaEditar}
      />
    </>
  );
}

export default Projetos;