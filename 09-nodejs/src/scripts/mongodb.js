/* docker ps
docker exec -it afa1b18096f3 mongo -u thiagocastilho -p admin --authenticationDatabase herois
// Mongo commands
show dbs
use herois
show collections */

db.herois.insert({
  nome: 'Flash',
  poder: 'Velocidade',
  dataNascimento: '1998-01-01'
})

db.herois.find()
db.herois.find().pretty()

for(let i=0; i <= 100000; i++) {
  db.herois.insert({
    nome: `Clone-${i}`,
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
  })
}

db.herois.count()
db.herois.findOne()
db.herois.find().limit(1000).sort({ nome: -1 })
db.herois.find({}, { poder: 1, _id: 0 })

// create
db.herois.insert({
  nome: 'Flash',
  poder: 'Velocidade',
  dataNascimento: '1998-01-01'
})

// read
db.herois.find()

// update
db.herois.update({ _id: ObjectId("5e1f92c712209e19b6f9022b")}, { nome: 'Mulher Maravilha' }) // modifica o documento inteiro
db.herois.update({ _id: ObjectId("5e1f92c712209e19b6f9022b")}, {$Set: { nome: 'Mulher Maravilha' } }) // atualiza apenas a chave especificada

// delete
db.herois.remove({}) // apaga o banco
db.herois.remove({ nome: 'Mulher Maravilha' }) // apaga o banco