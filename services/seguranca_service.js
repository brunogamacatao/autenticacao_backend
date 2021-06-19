const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const VALIDADE_TOKEN = parseInt(process.env.VALIDADE_TOKEN);
const BCRYPT_SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

const encripta = async (texto) => {
  return await bcrypt.hash(texto, BCRYPT_SALT_ROUNDS);
};

const compara = async (texto, textoEncriptado) => {
  return bcrypt.compare(texto, textoEncriptado);
};

/*
 * Função que cria um token JWT usando um usuário como payload.
 */
const criaToken = (usuario) => {
  let payload = {
    id: usuario._id,
    email: usuario.email
  };

  let token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: VALIDADE_TOKEN
  });

  return token;
};

/* 
 * Função de middleware que deve ser chamada antes das requisições a backends
 * que só possam ser acessados por usuários autenticados.
 */
const isAutenticado = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(401).send({ 
      auth: false, 
      message: 'Não foi encontrado o token no cabeçalho da requisição.'
    });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) { // se o token é inválido
      return res.status(500).send({ 
        auth: false, 
        message: 'Token inválido.' 
      });
    } else { // se o token é válido
      Usuario.findById(decoded.id, (err, usuario) => {
        req.usuario = usuario;
        next();
      });
    }
  });
};

const hasRole = (role) => {
  return (req, res, next) => {
    if (req.usuario.role === role) {
      next();
    } else {
      return res.status(401).send({ 
        auth: false, 
        message: 'Você não tem autorização para acessar esse recurso'
      });
    }
  };
};

const podeAcessar = (roles) => {
  return (req, res, next) => {
    let pode = false;

    roles.forEach((role) => {
      if (req.usuario.role === role) {
        pode = true;
      }
    });

    if (pode) {
      next();
    } else {
      res.status(403).send({auth: false, message: 'Você não tem autorização para acessar esse recurso'});
    }
  };
};

const validaLogin = async (usuario, senha) => {
  if (!usuario) {
    throw 'Não foi encontrado um usuário com o email informado!';
  } else if (await compara(senha, usuario.senha)) {
    // verifica se o usuário está bloqueado
    if (usuario.bloqueado) {
      throw 'O usuário está bloqueado. Procure o administrador do sistema';
    }

    // login válido
    return true;
  } else {
    throw 'Senha inválida!';
  }
};

module.exports = {
  encripta,
  compara,
  criaToken,
  isAutenticado,
  hasRole,
  validaLogin,
  podeAcessar
};