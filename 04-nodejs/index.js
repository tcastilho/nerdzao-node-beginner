const Commander = require('commander'),
  Database = require('./database'),
  Heroi = require('./heroi')

async function main() {
  Commander
    .version('v1')
    .option('-n, --nome [value]', "Nome do Heroi")
    .option('-p, --poder [value]', "Poder do Heroi")
    .option('-i, --id [value]', "ID do Heroi")
    .option('-c, --cadastrar', "Cadastrar um Heroi")
    .option('-l, --listar', "Listar um Heroi")
    .option('-r, --remover', "Remove um Heroi pelo ID")
    .option('-a, --atualizar [value]', "Atualizar um Heroi pelo ID")
    .parse(process.argv)
  const heroi = new Heroi(Commander)
  try {
    if (Commander.cadastrar) {
      delete heroi.id
      const resultado = await Database.cadastrar(heroi)
      if (!resultado) {
        console.error('Heroi nao foi cadastrado')
        return;
      }
      console.log('Heroi cadastrado com sucesso')
    }
    if (Commander.listar) {
      const resultado = await Database.listar()
      console.log(resultado)
      return;
    }
    if (Commander.remover) {
      const resultado = await Database.remover(heroi.id)
      if (!resultado) {
        console.error('Nao foi possivel remover o heroi')
        return;
      }
      console.log('Heroi removido com sucesso')
    }
    if (Commander.atualizar) {
      const idParaAtualizar = parseInt(Commander.atualizar),
      // remover todas as chaves que estiverem com undefined | null
        dado = JSON.stringify(heroi),
        heroiAtualizar = JSON.parse(dado),
        resultado = await Database.atualizar(idParaAtualizar, heroiAtualizar)
      if (!resultado) {
        console.error('Nao foi possivel atualizar o heroi')
        return;
      }
      console.error('Heroi atualizado com sucesso')

    }
  } catch (error) {
    console.error('DEU RUIM',  error)
  }
}

main()