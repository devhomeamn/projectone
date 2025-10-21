const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Section = require('./sectionModel');
const Subcategory = require('./subcategoryModel');

const Record = sequelize.define('Record', {
  file_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rack_no: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  added_by: {
    type: DataTypes.STRING, // user email বা username
    allowNull: false
  },
  is_moved_to_central: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// Relation setup
Section.hasMany(Record, { foreignKey: 'section_id', onDelete: 'SET NULL' });
Record.belongsTo(Section, { foreignKey: 'section_id' });

Subcategory.hasMany(Record, { foreignKey: 'subcategory_id', onDelete: 'SET NULL' });
Record.belongsTo(Subcategory, { foreignKey: 'subcategory_id' });

module.exports = Record;
