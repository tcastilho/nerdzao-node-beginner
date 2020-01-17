const Sequelize = require('sequelize')

const HeroiSchema = {
  name: 'herois',
  schema: {
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
  },
  options: {
    tableName: 'TB_HEROIS',
    freeseTableName: false,
    timestamps: false
  }
}

module.exports = HeroiSchema