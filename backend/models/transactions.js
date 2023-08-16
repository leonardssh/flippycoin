const { DataTypes } = require('sequelize')

const transactionModel = database => {
  return database.define(
    'transaction',
    {
      id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true
      },
      transactionHash: {
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
  transactionModel
}
