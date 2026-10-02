import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize.js';

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'project_id',
    },
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true,
    underscored: true,
  }
);

export default Task;
