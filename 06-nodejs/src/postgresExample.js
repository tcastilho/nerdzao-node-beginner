// npm install sequelize pg-hstore pg
const Sequelize = require('sequelize')

const driver = new Sequelize(
  'HEROES',
  'thiagocastilho',
  'admin', {
    host: 'localhost',
    dialect: 'postgres',
    quoteIdentifiers: false,
    operatorsAliases: false
  }
)

async function main() {
  const Herois = driver.define('herois', {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: Sequelize.STRING,
      require: true
    },
    poder: {
      type: Sequelize.STRING,
      require: true
    }
  }, {
    tableName: 'TB_HEROIS',
    freeseTableName: false,
    timestamps: false
  })
  await Herois.sync()
  await Herois.create({
    nome: 'Lanterna Verde',
    poder: 'anel'
  })

  const result = await Herois.findAll({
    raw: true
  })
  console.log('resultado', result)
}

main()