const express = require('express');
const router = express.Router();
const Seguranca = require('../services/seguranca_service');
const Usuario = require('../models/usuario');

router.post('/', async (req, res) => {
  let usuario = await Usuario.findOne({email: req.body.email});

  try {
    await Seguranca.validaLogin(usuario, req.body.senha);

    let token = Seguranca.criaToken(usuario);
    res.status(200).json({ auth: true, token, role: usuario.role });
  } catch (erro) {
    res.status(401).json({ auth: false, erro });
  }
});

module.exports = router;