const express = require('express');
const router = express.Router();
const Seguranca = require('../services/seguranca_service');

const filmes = [
  {'nome': 'Titanic'},
  {'nome': 'Harry Potter'},
  {'nome': 'Senhor dos Aneis'}
];

// criar algumas funções de middleware para ajudar no resto
// do controller
const findById = (req, res, next) => {
  if (req.params.id) {
    const id = parseInt(req.params.id);

    if (id < 0 || id >= filmes.length) {
      res.status(404).json({erro: `Não foi encontrado um filme com o id: ${id}`});
    } else {
      const filme = filmes[id];
      req.filme = filme;

      next();
    }
  } else {
    res.status(500).json({erro: 'Faltou o parâmetro id'});
  }
};

// rotas do controller
router.get('/', (req, res) => {
  res.json(filmes);
});

router.get('/:id', Seguranca.isAutenticado, findById, (req, res) => {
  res.json(req.filme);
});

router.put('/:id', findById, (req, res) => {
  res.send(`Retorna o filme com id: ${req.params.id}`);
});

router.delete('/:id', Seguranca.isAutenticado, 
                      Seguranca.podeAcessar(['administrador']), 
                      findById, 
                      (req, res) => {
  res.send(`Retorna o filme com id: ${req.params.id}`);
});


module.exports = router;