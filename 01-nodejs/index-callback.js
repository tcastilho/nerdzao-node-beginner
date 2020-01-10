/**
 * 0 Obter um usuario
 * 1 Obter o numero de telefone de umusuario a partir de seu Id
 * 2 Obter o endereco do usuario pelo Id
 */

function obterUsuario(callback) {
  setTimeout(function () {
    return callback(null, {
      id: 1,
      nome: 'Aladin',
      dataNascimento: new Date()
    })
  }, 1000)
}

function obterTelefone(idUsuario, callback) {
  setTimeout(() => {
    return callback(null, {
      telefone: '99966123',
      ddd: 11
    })
  }, 2000)
}

function obterEndereco(idUsuario, callback) {
  setTimeout(() => {
    return callback(null, {
      rua: 'dos bobos',
      numero: 0
    })
  }, 2000)

}

function resolverUsuario(erro,  usuario) {
  console.log('usuario', usuario)
}
obterUsuario(function resolverUsuario(error,  usuario) {
  // null || '' || 0 === false
  if (error) {
    console.error('DEU RUIM em USUARIO', error)
    return;
  }
  obterTelefone(usuario.id, function resolverTelefone(error1, telefone) {
    if (error1) {
      console.error('DEU RUIM em TELEFONE', error1)
      return;
    }
    obterEndereco(usuario.id, function resolverEndereco(error2, endereco) {
      if (error2) {
        console.error('DEU RUIM em ENDERECO', error2)
        return;
      }

      console.log(`
        Nome: ${usuario.nome},
        Endereco: ${endereco.rua}, ${endereco.numero},
        Telefone: (${telefone.ddd}) ${telefone.telefone}
      `)
    })
  })
})
// const usuario = obterUsuario(resolverUsuario)
// const telefone = obterTelefone(usuario.id)

// console.log('telefone', telefone)