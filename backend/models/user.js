const { DataTypes } = require('sequelize')

const userModel = database => {
  return database.define(
    'user',
    {
      id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true
      },
      wallet: {
        type: DataTypes.STRING,
        allowNull: false
      },
      balance: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: false,
        defaultValue: 0
      },
      demoBalance: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: false,
        defaultValue: 0.5
      }
    },
    {
      underscored: true,
      freezeTableName: true
    }
  )
}

module.exports = {
  userModel
}
