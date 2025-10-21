const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Section = require('./sectionModel');

const Subcategory = sequelize.define('Subcategory', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Section.hasMany(Subcategory, { foreignKey: 'section_id', onDelete: 'CASCADE' });
Subcategory.belongsTo(Section, { foreignKey: 'section_id' });

module.exports = Subcategory;
