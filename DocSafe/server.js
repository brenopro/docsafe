// Adições importantes
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

// Cria pasta 'uploads' se não existir
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

// Servidor
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import yup from 'yup';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Permite acessar imagens publicamente

const SECRET = 'xN8$gL@3m^tWq7#ZsE1rK!cP9vJ*YlA0dF';

// Login
app.post('/usuarios/mk', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await prisma.user.findUnique({ where: { email } });
    if (!usuario) return res.status(400).json({ error: true, mensagem: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ error: true, mensagem: 'Senha incorreta' });

    const token = jwt.sign({ id: usuario.id }, SECRET, { expiresIn: '1h' });
    return res.json({
      error: false,
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        foto: usuario.foto || null
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: true, mensagem: 'Erro no servidor' });
  }
});

// Criar usuário
app.post('/usuarios', async (req, res) => {
  const schema = yup.object().shape({
    name: yup.string(),
    age: yup.number().positive(),
    email: yup.string().email(),
    senha: yup.string().min(6)
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: true, mensagem: "Erro: preencha todos os campos" });
  }
  const senhaHash = await bcrypt.hash(req.body.senha, 10);
  await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age,
      senha: senhaHash
    }
  });
  return res.status(201).json({ error: false, mensagem: "Usuário adicionado com sucesso" });
});

// Listar usuários
app.get('/usuarios', async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});

// Upload de imagem
app.post('/upload', upload.single('file'), async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: true, mensagem: 'Token não fornecido' });

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.id;

    const caminhoFoto = req.file.path;

    const usuarioAtualizado = await prisma.user.update({
      where: { id: userId },
      data: { foto: caminhoFoto }
    });

    return res.json({ error: false, mensagem: 'Imagem enviada com sucesso', usuario: usuarioAtualizado });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, mensagem: 'Erro ao processar upload' });
  }
});

// Rota para listar fotos do usuário (no backend)
app.get('/fotos', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: true, mensagem: 'Token não fornecido' });

    try {
        const [, token] = authHeader.split(' ');
        const decoded = jwt.verify(token, SECRET);
        const userId = decoded.id;

        // Busca o usuário e sua foto
        const usuario = await prisma.user.findUnique({
            where: { id: userId },
            select: { foto: true }
        });

        if (!usuario.foto) {
            return res.json({ error: false, fotos: [] });
        }

        // Monta a URL completa da imagem (incluindo o domínio)
        const dominio = req.get('host'); // Pega "localhost:3000" ou seu domínio
        const urlCompleta = `http://${dominio}${usuario.foto.replace('uploads\\', '/uploads/')}`;

        return res.json({
            error: false,
            fotos: [{
                id: userId,
                url: urlCompleta // Ex: "http://localhost:3000/uploads/foto-123.jpg"
            }]
        });

    } catch (error) {
        console.error('Erro ao buscar fotos:', error);
        return res.status(401).json({ error: true, mensagem: 'Token inválido' });
    }
});


// Inicia servidor
app.listen(3000);
app.post







/*|
179.113.95.117

brenogs 

DXT@z#sH-#3J3e@


*/

