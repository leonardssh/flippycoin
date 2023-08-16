const { DataTypes } = require('sequelize')

const gameModel = database => {
  return database.define(
    'game',
    {
      id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true,
      freezeTableName: true
    }
  )
}

module.exports = {
  gameModel
}
