/**
 * 0 Obter um usuario
 * 1 Obter o numero de telefone de umusuario a partir de seu Id
 * 2 Obter o endereco do usuario pelo Id
 */
// importamos um módulo interno do node.js
const util = require('util')
const obterEnderecoAsync = util.promisify(obterEndereco)

function obterUsuario() {
  // quando der algum problema -> reject(ERROR)
  // quando der sucesso -> resolve()
  return new Promise(function resolvePromise(resolve, reject) {
    setTimeout(function () {
      // return reject(new Error('DEU RUIM DE VERDADE!'))
      return resolve({
        id: 1,
        nome: 'Aladin',
        dataNascimento: new Date()
      })
    }, 1000)
  })
}

function obterTelefone(idUsuario) {
  return new Promise(function resolvePromise(resolve, reject) {
    setTimeout(() => {
      return resolve({
        telefone: '999667123',
        ddd: 11
      })
    }, 2000)
  })
}

function obterEndereco(idUsuario, callback) {
  setTimeout(() => {
    return callback(null, {
      rua: 'dos bobos',
      numero: 0
    })
  }, 2000)

}

// 1º passo adicionar a palavra async -> automaticamente ela retornara uma Promise
main()
async function main() {
  try {
    console.time('medida-promise')
    const usuario = await obterUsuario()
    // const telefone = await obterTelefone(usuario.id)
    // const endereco = await obterEnderecoAsync(usuario.id)
    const resultado = await Promise.all([
      obterTelefone(usuario.id),
      obterEnderecoAsync(usuario.id)
    ])
    const [telefone, endereco] = resultado
    console.log(`
      Nome: ${usuario.nome}
      Endereco: ${endereco.rua}, ${endereco.numero}
      Telefone: (${telefone.ddd}) ${telefone.telefone}
    `)
    console.timeEnd('medida-promise')
  } catch (err) {
    console.error('DEU RUIM', err)
  }
}