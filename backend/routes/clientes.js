import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'sua-chave-secreta-aqui';

const router = express.Router();

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acesso requerido'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido'
      });
    }
    req.user = user;
    next();
  });
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o arquivo de dados
const dataPath = path.join(__dirname, '../data/clientes.json');

// Função para ler dados
const readData = () => {
  try {
    if (!fs.existsSync(dataPath)) {
      return [];
    }
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler arquivo de clientes:', error);
    return [];
  }
};

// Função para salvar dados
const saveData = (data) => {
  try {
    // Garantir que o diretório existe
    const dir = path.dirname(dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erro ao salvar arquivo de clientes:', error);
    return false;
  }
};

// GET - Listar clientes do usuário autenticado
router.get('/', authenticateToken, (req, res) => {
  try {
    const clientes = readData();
    // Filtrar clientes do usuário logado
    const clientesUsuario = clientes.filter(c => c.usuarioId === req.user.id);
    res.json({
      success: true,
      data: clientesUsuario
    });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor' 
    });
  }
});

// GET - Buscar cliente por ID (apenas do usuário autenticado)
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const clientes = readData();
    const cliente = clientes.find(c => c.id === req.params.id && c.usuarioId === req.user.id);
    
    if (!cliente) {
      return res.status(404).json({ 
        success: false,
        message: 'Cliente não encontrado ou acesso negado' 
      });
    }
    
    res.json({
      success: true,
      data: cliente
    });
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor' 
    });
  }
});

// POST - Criar novo cliente (associado ao usuário autenticado)
router.post('/', authenticateToken, (req, res) => {
  try {
    const clientes = readData();
    const novoCliente = {
      id: Date.now().toString(),
      ...req.body,
      usuarioId: req.user.id, // Associar ao usuário logado
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    clientes.push(novoCliente);
    
    if (saveData(clientes)) {
      res.status(201).json({
        success: true,
        data: novoCliente,
        message: 'Cliente criado com sucesso'
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: 'Erro ao salvar cliente' 
      });
    }
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor' 
    });
  }
});

// PUT - Atualizar cliente (apenas do usuário autenticado)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const clientes = readData();
    const index = clientes.findIndex(c => c.id === req.params.id && c.usuarioId === req.user.id);
    
    if (index === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Cliente não encontrado ou acesso negado' 
      });
    }
    
    clientes[index] = {
      ...clientes[index],
      ...req.body,
      usuarioId: req.user.id, // Manter associação ao usuário
      updatedAt: new Date().toISOString()
    };
    
    if (saveData(clientes)) {
      res.json({
        success: true,
        data: clientes[index],
        message: 'Cliente atualizado com sucesso'
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: 'Erro ao atualizar cliente' 
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor' 
    });
  }
});

// DELETE - Deletar cliente (apenas do usuário autenticado)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const clientes = readData();
    const index = clientes.findIndex(c => c.id === req.params.id && c.usuarioId === req.user.id);
    
    if (index === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Cliente não encontrado ou acesso negado' 
      });
    }
    
    clientes.splice(index, 1);
    
    if (saveData(clientes)) {
      res.json({ 
        success: true,
        message: 'Cliente deletado com sucesso' 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: 'Erro ao deletar cliente' 
      });
    }
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor' 
    });
  }
});

export default router;