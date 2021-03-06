'use strict';
const fs = require('fs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let data = JSON.parse(fs.readFileSync('./seeders/json/group-user.json', 'utf8'))
    data = data.map(temp => {
      temp.createdAt = new Date()
      temp.updatedAt = new Date()
      return temp
    })
    await queryInterface.bulkInsert('GroupUsers', data, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('GroupUsers', null, {});
  }
};
