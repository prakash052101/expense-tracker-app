const Sequelize = require('sequelize');
const sequelize = require('../database/db');
const { v4: uuidv4 } = require('uuid');

const Forgotpassword = sequelize.define('forgotpassword', {
    id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    active: {
    type: Sequelize.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    },
    userId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      }
})

module.exports = Forgotpassword;