const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const Seguranca = require('../services/seguranca_service');

router.get('/', async (req, res) => {
  res.json(await Usuario.find());
});

router.get('/:id', findPorId, async (req, res) => {
  res.json(req.usuario);
});

router.post('/', async (req, res) => {
  const dados = req.body;
  dados.senha = await Seguranca.encripta(dados.senha);

  try {
    const novo = await new Usuario(dados).save();
    res.status(201).json(novo);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.delete('/:id', findPorId, async (req, res) => {
  await req.usuario.remove();
});

router.put('/:id', findPorId, async (req, res) => {
  await req.usuario.set(req.body).save();
});

// função de middleware para recuperar um usuario pelo id
async function findPorId(req, res, next) {
  try {
    req.usuario = await Usuario.findById(req.params.id);
    
    if (req.usuario === null) {
      return res.status(404).json({ 
        message: 'Nao foi possivel encontrar um usuário com o id informado'
      });
    }
  } catch(err) {
    return res.status(500).json({ message: err.message });
  }

  next();
};

module.exports = router;
