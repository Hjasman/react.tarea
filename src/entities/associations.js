import User from './user.entity.js';
import Task from './task.entity.js';
import Project from './project.entity.js';

User.hasMany(Project, {
  foreignKey: 'userId',
  as: 'projects',
});

Project.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Project.hasMany(Task, {
  foreignKey: 'projectId',
  as: 'tasks',
});

Task.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project',
});
