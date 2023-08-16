const { DataTypes } = require('sequelize')

const historyModel = database => {
  return database.define(
    'history',
    {
      id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true
      },
      selection: {
        type: DataTypes.STRING,
        allowNull: false
      },
      betAmount: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: false,
        defaultValue: 0
      },
      wallet: {
        type: DataTypes.STRING,
        allowNull: false
      },
      demo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      underscored: true,
      freezeTableName: true
    }
  )
}

module.exports = {
  historyModel
}
