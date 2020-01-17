const Sequelize = require('sequelize')

const UsuarioSchema = {
  name: 'usuarios',
  schema: {
    id: {
      type: Sequelize.INTEGER,
      required: true,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      require: true
    },
    password: {
      type: Sequelize.STRING,
      require: true
    }
  },
  options: {
    tableName: 'TB_USUARIOS',
    freeseTableName: false,
    timestamps: false
  }
}

module.exports = UsuarioSchema