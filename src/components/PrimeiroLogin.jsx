import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api.js';
import './PrimeiroLogin.css';

const PrimeiroLogin = ({ userId, onLoginSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [mostrarSenhas, setMostrarSenhas] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErro('');
  };

  const validarFormulario = () => {
    if (!formData.senhaAtual || !formData.novaSenha || !formData.confirmarSenha) {
      setErro('Todos os campos são obrigatórios');
      return false;
    }

    if (formData.novaSenha.length < 6) {
      setErro('A nova senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.novaSenha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem');
      return false;
    }

    if (formData.senhaAtual === formData.novaSenha) {
      setErro('A nova senha deve ser diferente da senha atual');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/primeiro-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          senhaAtual: formData.senhaAtual,
          novaSenha: formData.novaSenha
        })
      });

      const data = await response.json();

      if (data.success) {
        // Salvar token no localStorage
        localStorage.setItem('saas_auth_token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        onLoginSuccess(data.usuario, data.token);
      } else {
        setErro(data.message || 'Erro ao alterar senha');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setErro('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="primeiro-login-overlay">
      <div className="primeiro-login-container">
        <div className="primeiro-login-header">
          <h2>Primeiro Acesso</h2>
          <p>Por segurança, você deve alterar sua senha temporária</p>
        </div>

        <form onSubmit={handleSubmit} className="primeiro-login-form">
          <div className="form-group">
            <label htmlFor="senhaAtual">Senha Temporária</label>
            <div className="input-container">
              <input
                type={mostrarSenhas ? 'text' : 'password'}
                id="senhaAtual"
                name="senhaAtual"
                value={formData.senhaAtual}
                onChange={handleChange}
                placeholder="Digite a senha temporária recebida"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="novaSenha">Nova Senha</label>
            <div className="input-container">
              <input
                type={mostrarSenhas ? 'text' : 'password'}
                id="novaSenha"
                name="novaSenha"
                value={formData.novaSenha}
                onChange={handleChange}
                placeholder="Digite sua nova senha (mín. 6 caracteres)"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
            <div className="input-container">
              <input
                type={mostrarSenhas ? 'text' : 'password'}
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="Confirme sua nova senha"
                required
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={mostrarSenhas}
                onChange={(e) => setMostrarSenhas(e.target.checked)}
              />
              <span className="checkmark"></span>
              Mostrar senhas
            </label>
          </div>

          {erro && (
            <div className="erro-message">
              <i className="fas fa-exclamation-triangle"></i>
              {erro}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn-cancelar"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-alterar"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Alterando...
                </>
              ) : (
                <>
                  <i className="fas fa-key"></i>
                  Alterar Senha
                </>
              )}
            </button>
          </div>
        </form>

        <div className="primeiro-login-info">
          <div className="info-item">
            <i className="fas fa-shield-alt"></i>
            <span>Sua nova senha será única e pessoal</span>
          </div>
          <div className="info-item">
            <i className="fas fa-lock"></i>
            <span>Use uma senha forte para maior segurança</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimeiroLogin;