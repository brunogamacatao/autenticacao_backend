const Usuario = require('./models/usuario');
const Seguranca = require('./services/seguranca_service');

const boot = async () => {
  console.log('Inicializando o sistema de autenticação ...');

  // Se não tem nenhum usuário cadastrado
  if (await Usuario.count() === 0) {
    // Cadastrar um usuário admin para testes
    let dados = {email: 'admin@email.com', senha: 'admin', validado: true, role: 'administrador'};
    dados.senha = await Seguranca.encripta(dados.senha);

    await Usuario(dados).save();

    // Cadastrar um usuário normal para testes
    dados = {email: 'usuario@email.com', senha: 'usuario', validado: true, role: 'usuario'};
    dados.senha = await Seguranca.encripta(dados.senha);

    await Usuario(dados).save();
  }

  console.log('Pronto !');
};

module.exports = {
  boot
};