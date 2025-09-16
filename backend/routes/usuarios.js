import express from 'express';
import { body, validationResult } from 'express-validator';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o arquivo de usuários
const USERS_FILE = path.join(__dirname, '../data/usuarios.json');
const JWT_SECRET = 'sua-chave-secreta-aqui';

// Função para garantir que o diretório de dados existe
const ensureDataDir = async () => {
  const dataDir = path.dirname(USERS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Função para ler usuários do arquivo
const readUsuarios = async () => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    // Se o arquivo não existe, retorna array vazio
    return [];
  }
};

// Função para salvar usuários no arquivo
const saveUsuarios = async (usuarios) => {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(usuarios, null, 2));
};

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

// Validações
const validateUsuario = [
  body('nome').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('cpfCnpj').optional().isLength({ min: 11 }).withMessage('CPF/CNPJ inválido')
];

const validateLogin = [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').notEmpty().withMessage('Senha é obrigatória')
];

// POST /api/v1/usuarios/registro - Registrar novo usuário
router.post('/registro', validateUsuario, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { nome, email, senha, telefone, empresa, cpfCnpj } = req.body;
    const usuarios = await readUsuarios();

    // Verificar se usuário já existe
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
      return res.status(409).json({
        success: false,
        message: 'Usuário já existe com este email'
      });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar novo usuário
    const novoUsuario = {
      id: uuidv4(),
      nome,
      email,
      senha: senhaHash,
      telefone: telefone || '',
      empresa: empresa || '',
      cpfCnpj: cpfCnpj || '',
      plano: 'basico',
      status: 'ativo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    usuarios.push(novoUsuario);
    await saveUsuarios(usuarios);

    // Gerar token JWT
    const token = jwt.sign(
      { userId: novoUsuario.id, email: novoUsuario.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remover senha da resposta
    const { senha: _senha, ...usuarioSemSenha } = novoUsuario;

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      usuario: usuarioSemSenha,
      token
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário'
    });
  }
});

// POST /api/v1/usuarios/login - Login de usuário
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { email, senha } = req.body;
    const usuarios = await readUsuarios();

    // Buscar usuário
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remover senha da resposta
    const { senha: _, ...usuarioSemSenha } = usuario;

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      usuario: usuarioSemSenha,
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login'
    });
  }
});

// GET /api/v1/usuarios/perfil - Buscar perfil do usuário logado
router.get('/perfil', authenticateToken, async (req, res) => {
  try {
    const usuarios = await readUsuarios();
    const usuario = usuarios.find(u => u.id === req.user.id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Remover senha da resposta
    const { senha: _, ...usuarioSemSenha } = usuario;

    res.json({
      success: true,
      data: usuarioSemSenha
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar perfil'
    });
  }
});

// PUT /api/v1/usuarios/perfil - Atualizar perfil do usuário
router.put('/perfil', authenticateToken, async (req, res) => {
  try {
    const { nome, telefone, empresa } = req.body;
    const usuarios = await readUsuarios();
    const usuarioIndex = usuarios.findIndex(u => u.id === req.user.id);

    if (usuarioIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Atualizar dados do usuário
    usuarios[usuarioIndex] = {
      ...usuarios[usuarioIndex],
      nome: nome || usuarios[usuarioIndex].nome,
      telefone: telefone || usuarios[usuarioIndex].telefone,
      empresa: empresa || usuarios[usuarioIndex].empresa,
      updated_at: new Date().toISOString()
    };

    await saveUsuarios(usuarios);

    // Remover senha da resposta
    const { senha: _, ...usuarioSemSenha } = usuarios[usuarioIndex];

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: usuarioSemSenha
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil'
    });
  }
});

// PUT /api/v1/usuarios/senha - Alterar senha
router.put('/senha', authenticateToken, async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual e nova senha são obrigatórias'
      });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Nova senha deve ter pelo menos 6 caracteres'
      });
    }

    const usuarios = await readUsuarios();
    const usuarioIndex = usuarios.findIndex(u => u.id === req.user.id);

    if (usuarioIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar senha atual
    const senhaValida = await bcrypt.compare(senhaAtual, usuarios[usuarioIndex].senha);
    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Hash da nova senha
    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar senha
    usuarios[usuarioIndex].senha = novaSenhaHash;
    usuarios[usuarioIndex].updated_at = new Date().toISOString();

    await saveUsuarios(usuarios);

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao alterar senha'
    });
  }
});

// GET /api/v1/usuarios - Listar usuários (admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const usuarios = await readUsuarios();
    
    // Remover senhas da resposta
    const usuariosSemSenha = usuarios.map(usuario => {
      const { senha: _senha, ...usuarioSemSenha } = usuario;
      return usuarioSemSenha;
    });

    res.json({
      success: true,
      data: usuariosSemSenha
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar usuários'
    });
  }
});

export default router;