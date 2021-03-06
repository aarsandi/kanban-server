'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.hasMany(models.Comment)
      Task.belongsTo(models.User)
      Task.belongsTo(models.Group)
    }
  };
  Task.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'fill in the title field'
        },
        notNull: {
          msg: 'fill in the title field'
        }
      }
    },
    content: DataTypes.TEXT,
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'fill in the category field'
        },
        notNull: {
          msg: 'fill in the category field'
        }
      }
    },
    duedate: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'due date must be a date type'
        }
      }
    },
    UpdatedBy: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    GroupId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};