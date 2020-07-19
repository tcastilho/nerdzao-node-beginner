// npm install mongoose

const Mongoose = require('mongoose')
Mongoose.connect('mongodb://thiagocastilho:admin@localhost:27017/herois', { useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
  if(!error) return;
  console.log('Falha na conexao', error)
})

const connection = Mongoose.connection
connection.once('open', () => console.log('database rodando'))
/* setTimeout(() => {
  const state = connection.readyState
  console.log('state', state)
}, 1000) */
/* 
  0: Disconectado
  1: Conectado
  2: Conectando
  3: Disconectando
 */

const heroiSchema = new Mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  poder: {
    type: String,
    required: true
  },
  insertedAt: {
    type: Date,
    default: new Date()
  }
})
const model = Mongoose.model('heroi', heroiSchema)

async function main() {
  const resultCadastrar = model.create({
    nome: 'Batman',
    poder: 'Dinheiro'
  })
  console.log('result cadastrar', resultCadastrar)

  const listItens = await model.find()
  console.log('items', listItens)
}
main()