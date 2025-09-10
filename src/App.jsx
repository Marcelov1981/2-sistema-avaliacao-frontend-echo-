import React, { useState, useEffect, useCallback, useRef } from 'react';
import Clientes from './components/Cliente';
import Orcamentos from './components/Orçamentos';
import Projetos from './components/Projetos';
import Avaliacao from './components/Avaliacao';
import Laudos from './components/Laudos';
import NovoCliente from './components/NovoCliente';
import NovoProjeto from './components/NovoProjeto';
import NovoOrcamento from './components/NovoOrcamento';
import NovoLaudo from './components/NovoLaudo';
import NovaAvaliacao from './components/NovaAvaliacao';
import PropertyAnalysisSystem from './components/PropertyAnalysisSystem';
import { appStyles, getSidebarStyles, otherStyles } from './styles/appStyles';

const SaaSApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Usando inputs não controlados para evitar interferência
  const [isLogin, setIsLogin] = useState(true);
  const [showNovoCliente, setShowNovoCliente] = useState(false);
  const [showNovoProjeto, setShowNovoProjeto] = useState(false);
  const [showNovoOrcamento, setShowNovoOrcamento] = useState(false);
  const [showNovoLaudo, setShowNovoLaudo] = useState(false);
  const [showNovaAvaliacao, setShowNovaAvaliacao] = useState(false);
  const [showAnaliseImagens, setShowAnaliseImagens] = useState(false);
  
  // Refs para os inputs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Simular verificação de autenticação ao carregar
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('isAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Limpar formulário quando o estado de autenticação mudar
  useEffect(() => {
    if (!isAuthenticated) {
      if (emailRef.current) emailRef.current.value = '';
      if (passwordRef.current) passwordRef.current.value = '';
    }
  }, [isAuthenticated]);

  // Handler apenas para limitar senha
  const handlePasswordInput = useCallback((e) => {
    const value = e.target.value.slice(0, 10);
    e.target.value = value;
  }, []);

  const handleAuth = useCallback((e) => {
    e.preventDefault();
    const emailValue = emailRef.current?.value || '';
    const passwordValue = passwordRef.current?.value || '';
    
    if (emailValue && passwordValue && passwordValue.length >= 6 && passwordValue.length <= 10) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');
      // Limpar formulário após login bem-sucedido
      if (emailRef.current) emailRef.current.value = '';
      if (passwordRef.current) passwordRef.current.value = '';
    } else if (passwordValue.length < 6 || passwordValue.length > 10) {
      alert('A senha deve ter entre 6 e 10 caracteres.');
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
    setActiveSection('dashboard');
    // Limpar formulário ao fazer logout
    if (emailRef.current) emailRef.current.value = '';
    if (passwordRef.current) passwordRef.current.value = '';
  }, []);

  // Reset global styles
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Combina estilos estáticos com estilos dinâmicos
  const sidebarStyles = getSidebarStyles(sidebarOpen);
  const styles = {
    ...appStyles,
    ...sidebarStyles,
    ...otherStyles
  };

  // Ícones SVG
  const icons = {
    menu: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
    x: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    user: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    folder: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
    calculator: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="10" x2="8" y2="10"></line><line x1="12" y1="10" x2="12" y2="10"></line><line x1="16" y1="10" x2="16" y2="10"></line><line x1="8" y1="14" x2="8" y2="14"></line><line x1="12" y1="14" x2="12" y2="14"></line><line x1="16" y1="14" x2="16" y2="14"></line><line x1="8" y1="18" x2="8" y2="18"></line><line x1="12" y1="18" x2="12" y2="18"></line><line x1="16" y1="18" x2="16" y2="18"></line></svg>,
    star: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon></svg>,
    file: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>,
    image: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21,15 16,10 5,21"></polyline></svg>,
    logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16,17 21,12 16,7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    lock: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><circle cx="12" cy="16" r="1"></circle><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
    mail: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'menu' },
    { id: 'cliente', label: 'Cliente', icon: 'user' },
    { id: 'projeto', label: 'Projeto', icon: 'folder' },
    { id: 'orcamento', label: 'Orçamento', icon: 'calculator' },
    { id: 'avaliacao', label: 'Avaliação', icon: 'star' },
    { id: 'laudo', label: 'Laudo', icon: 'file' },
    { id: 'analise-imagens', label: 'Análise de Imagens', icon: 'image' }
  ];

  // Componente de Login
  const LoginPage = () => (
    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={styles.logoContainer}>
            {icons.lock}
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>GeoMind</h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            {isLogin ? 'Faça login em sua conta' : 'Crie sua nova conta'}
          </p>
        </div>

        <form onSubmit={handleAuth} style={{ marginBottom: '24px' }} key={`login-form-${isAuthenticated}`}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              {icons.mail}
            </div>
            <input
              ref={emailRef}
              id="login-email-field"
              name="email"
              type="email"
              placeholder="Email"
              defaultValue=""
              style={{ ...styles.input, paddingLeft: '50px', marginBottom: 0 }}
              autoComplete="off"
              autoFocus={!isAuthenticated}
              required
            />
          </div>
          
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <input
              ref={passwordRef}
              id="login-password-field"
              name="password"
              type="password"
              placeholder="Senha (6-10 caracteres)"
              defaultValue=""
              onInput={handlePasswordInput}
              minLength={6}
              maxLength={10}
              style={{ ...styles.input, paddingLeft: '50px', marginBottom: 0 }}
              autoComplete="off"
              required
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#64748b', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );

  // Componente de Sidebar
  const Sidebar = () => (
    <div style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        {sidebarOpen && (
          <h2 style={{ 
            fontWeight: 'bold', 
            fontSize: '20px', 
            margin: 0
          }}>
            GeoMind
          </h2>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            ...styles.iconButton,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
        >
          {sidebarOpen ? icons.x : icons.menu}
        </button>
      </div>

      <nav style={styles.sidebarNav}>
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            style={{
              ...styles.sidebarItem,
              ...(activeSection === item.id ? styles.sidebarItemActive : {}),
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              padding: sidebarOpen ? '12px' : '12px 8px'
            }}
            onMouseOver={(e) => {
              if (activeSection !== item.id) {
                e.target.style.backgroundColor = '#334155';
                e.target.style.color = 'white';
              }
            }}
            onMouseOut={(e) => {
              if (activeSection !== item.id) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#cbd5e1';
              }
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '24px'
            }}>
              {icons[item.icon]}
            </div>
            {sidebarOpen && (
              <span style={{ marginLeft: '12px' }}>
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div style={styles.sidebarFooter}>
        <button
          onClick={handleLogout}
          style={{
            ...styles.sidebarItem,
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            padding: sidebarOpen ? '12px' : '12px 8px'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#dc2626';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#cbd5e1';
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '20px'
          }}>
            {icons.logout}
          </div>
          {sidebarOpen && (
            <span style={{ marginLeft: '12px' }}>
              Sair
            </span>
          )}
        </button>
      </div>
    </div>
  );

  // Componente de Conteúdo Principal
  const MainContent = () => {
    const renderContent = () => {
      switch (activeSection) {
        case 'dashboard':
          return (
            <>
              <div style={styles.pageHeader}>
                <h1 style={styles.pageTitle}>Dashboard</h1>
                <p style={styles.pageSubtitle}>Bem-vindo ao GeoMind</p>
              </div>
              
              <div style={styles.dashboardGrid}>
                {[
                  { title: 'Clientes', value: '124', color: '#10b981', icon: 'user', section: 'cliente' },
                  { title: 'Projetos', value: '43', color: '#0d9488', icon: 'folder', section: 'projeto' },
                  { title: 'Orçamentos', value: '28', color: '#0891b2', icon: 'calculator', section: 'orcamento' },
                  { title: 'Avaliação', value: '15', color: '#8b5cf6', icon: 'star', section: 'avaliacao' },
                  { title: 'Laudos', value: '17', color: '#3b82f6', icon: 'file', section: 'laudo' }
                ].map((card, index) => (
                  <div 
                    key={index} 
                    style={{
                      ...styles.card,
                      cursor: 'pointer'
                    }}
                    onClick={() => setActiveSection(card.section)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={styles.cardContent}>
                      <div style={styles.cardInfo}>
                        <p style={styles.cardTitle}>{card.title}</p>
                        <p style={styles.cardValue}>{card.value}</p>
                      </div>
                      <div style={{ ...styles.cardIcon, backgroundColor: card.color }}>
                        {icons[card.icon]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          );
        
        case 'cliente':
          return (
            <>
              <div style={styles.pageHeader}>
                <h1 style={styles.pageTitle}>Gestão de Clientes</h1>
                <button 
                  style={styles.actionButton}
                  onClick={() => setShowNovoCliente(true)}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Novo Cliente
                </button>
              </div>
              
              <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Lista de Clientes</h3>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Nome</th>
                        <th style={styles.tableHeader}>Email</th>
                        <th style={styles.tableHeader}>Status</th>
                        <th style={styles.tableHeader}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <Clientes />
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          );

        case 'orcamento':
          return (
            <>
              <div style={styles.pageHeader}>
                <h1 style={styles.pageTitle}>Gestão de Orçamentos</h1>
                <button 
                  style={styles.actionButton}
                  onClick={() => setShowNovoOrcamento(true)}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Novo Orçamento
                </button>
              </div>
              
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Lista de Orçamentos</h3>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Email</th>
                        <th style={styles.tableHeader}>Status</th>
                        <th style={styles.tableHeader}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <Orcamentos />
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          );

        case 'projeto':
          return (
            <>
              <div style={styles.pageHeader}>
                <h1 style={styles.pageTitle}>Gestão de Projetos</h1>
                <button 
                  style={styles.actionButton}
                  onClick={() => setShowNovoProjeto(true)}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Novo Projeto
                </button>
              </div>
              
              <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Lista de Projetos</h3>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Nome</th>
                        <th style={styles.tableHeader}>Cliente</th>
                        <th style={styles.tableHeader}>Tipo Imóvel</th>
                        <th style={styles.tableHeader}>Endereço</th>
                        <th style={styles.tableHeader}>Cidade</th>
                        <th style={styles.tableHeader}>Estado</th>
                        <th style={styles.tableHeader}>CEP</th>
                        <th style={styles.tableHeader}>Área Terreno</th>
                        <th style={styles.tableHeader}>Área Construída</th>
                        <th style={styles.tableHeader}>Finalidade</th>
                        <th style={styles.tableHeader}>Prazo Entrega</th>
                        <th style={styles.tableHeader}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <Projetos />
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          );

        case 'avaliacao':
          return (
            <>
              <div style={styles.pageHeader}>
                <h1 style={styles.pageTitle}>Gestão de Avaliações</h1>
                <button 
                  style={styles.actionButton}
                  onClick={() => setShowNovaAvaliacao(true)}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Nova Avaliação
                </button>
              </div>
              
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Lista de Avaliações</h3>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Tipo</th>
                        <th style={styles.tableHeader}>Cliente</th>
                        <th style={styles.tableHeader}>Status</th>
                        <th style={styles.tableHeader}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <Avaliacao />
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          );

        case 'laudo':
          return (
            <>
              <div style={styles.pageHeader}>
                <h1 style={styles.pageTitle}>Gestão de Laudos</h1>
                <button 
                  style={styles.actionButton}
                  onClick={() => setShowNovoLaudo(true)}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Novo Laudo
                </button>
              </div>
              
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Lista de Laudos</h3>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Número</th>
                        <th style={styles.tableHeader}>Cliente</th>
                        <th style={styles.tableHeader}>Status</th>
                        <th style={styles.tableHeader}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <Laudos />
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          );

        case 'analise-imagens':
          return (
            <>
              <div style={styles.pageHeader}>
                <h1 style={styles.pageTitle}>Análise Comparativa de Imagens</h1>
                <button 
                  style={styles.actionButton}
                  onClick={() => setShowAnaliseImagens(true)}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Iniciar Análise
                </button>
              </div>
              
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Sistema de Análise Comparativa</h3>
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      color: '#2563eb'
                    }}>
                      {icons.image}
                    </div>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
                      Análise Inteligente de Imagens Imobiliárias
                    </h4>
                    <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: '1.6' }}>
                      Compare imagens de webscraping com seu banco de dados para análise de valor e autenticidade de imóveis.
                      O sistema utiliza algoritmos avançados para detectar similaridades, qualidade e consistência visual.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                      <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <h5 style={{ fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Qualidade de Imagem</h5>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Análise de resolução, nitidez e brilho</p>
                      </div>
                      <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <h5 style={{ fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Similaridade Visual</h5>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Comparação de características visuais</p>
                      </div>
                      <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <h5 style={{ fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Relatório de Avaliação</h5>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Geração automática de relatórios detalhados</p>
                      </div>
                    </div>
                    <button 
                      style={{
                        ...styles.actionButton,
                        fontSize: '16px',
                        padding: '12px 24px'
                      }}
                      onClick={() => setShowAnaliseImagens(true)}
                      onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      Começar Análise
                    </button>
                  </div>
                </div>
              </div>
            </>
          );

        default:
          return (
            <>
              <div style={styles.pageHeader}>
                <h1 style={styles.pageTitle}>
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </h1>
              </div>
              
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={styles.card}>
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      color: '#059669'
                    }}>
                      {icons.file}
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
                      Módulo {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6' }}>
                      Este módulo está em desenvolvimento. Em breve você poderá gerenciar seus {activeSection}s aqui.
                    </p>
                  </div>
                </div>
              </div>
            </>
          );
      }
    };

    return (
      <div style={styles.mainContent}>
        <div style={styles.contentArea}>
          {renderContent()}
        </div>
      </div>
    );
  };

  // Renderização principal
  if (!isAuthenticated) {
    return (
      <div style={styles.appContainer}>
        <LoginPage />
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      <div style={styles.mainAppContainer}>
        <Sidebar />
        <MainContent />
      </div>
      <NovoCliente
        isOpen={showNovoCliente}
        onClose={() => setShowNovoCliente(false)}
        onClienteCreated={() => {
          // Callback para atualizar lista de clientes se necessário
          console.log('Cliente criado com sucesso!');
        }}
      />
      
      <NovoProjeto
         isOpen={showNovoProjeto}
         onClose={() => setShowNovoProjeto(false)}
         onProjetoCreated={() => {
           // Callback para atualizar lista de projetos se necessário
           console.log('Projeto criado com sucesso!');
         }}
       />
       
       <NovoOrcamento
         isOpen={showNovoOrcamento}
         onClose={() => setShowNovoOrcamento(false)}
         onOrcamentoCreated={() => {
           // Callback para atualizar lista de orçamentos se necessário
           console.log('Orçamento criado com sucesso!');
         }}
       />
       
       <NovoLaudo
         isOpen={showNovoLaudo}
         onClose={() => setShowNovoLaudo(false)}
         onLaudoCreated={() => {
           // Callback para atualizar lista de laudos se necessário
           console.log('Laudo criado com sucesso!');
         }}
       />
       
       <NovaAvaliacao
         isOpen={showNovaAvaliacao}
         onClose={() => setShowNovaAvaliacao(false)}
         onAvaliacaoCreated={() => {
           setShowNovaAvaliacao(false);
           // Callback para atualizar lista de avaliações se necessário
           console.log('Avaliação criada com sucesso!');
         }}
       />
       
       <PropertyAnalysisSystem
         visible={showAnaliseImagens}
         onClose={() => setShowAnaliseImagens(false)}
       />
    </div>
  );
};

export default SaaSApp;