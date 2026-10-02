import Project from '../entities/project.entity.js';
import Task from '../entities/task.entity.js';

/**
 * Obtiene todos los proyectos que le pertenecen a un usuario dado.
 * @param {string} userId - ID del usuario dueño
 * @returns {Promise<Array<Model>>} Lista de proyectos
 */
export const findAllByUser = async (userId) => {
  return await Project.findAll({
    where: {
      userId,
    },
    attributes: ['id', 'name', 'description', 'status'],
  });
};

/**
 * Crea un registro de proyecto en la base de datos.
 * @param {Object} data - Datos base del proyecto
 * @param {string} userId - ID del usuario creador
 * @returns {Promise<Model>} El registro de proyecto recién creado
 */
export const create = async (data, userId) => {
  return await Project.create({
    ...data,
    userId,
  });
};

/**
 * Busca un proyecto por su ID y se asegura que pertenezca al usuario especificado.
 * Carga también las tareas asociadas al proyecto.
 * @param {string} id - ID del proyecto
 * @param {string} userId - ID del usuario dueño
 * @returns {Promise<Model|null>} El proyecto con sus tareas, o null
 */
export const findById = async (id, userId) => {
  return await Project.findOne({
    where: {
      id,
      userId,
    },
    attributes: ['id', 'name', 'description', 'status'],
    include: [
      {
        model: Task,
        as: 'tasks',
        attributes: ['id', 'title', 'description', 'completed'],
      },
    ],
  });
};

/**
 * Actualiza los datos de un proyecto específico del usuario.
 * @param {string} id - ID del proyecto
 * @param {string} userId - ID del usuario dueño
 * @param {Object} data - Objeto con los nuevos valores
 * @returns {Promise<Model|null>} El proyecto tras la actualización, o null si no se encontró
 */
export const update = async (id, userId, data) => {
  const project = await findById(id, userId);
  if (!project) {
    return null;
  }
  return await project.update(data);
};

/**
 * Marca lógicamente un proyecto como eliminado (status = 'deleted').
 * @param {string} id - ID del proyecto
 * @param {string} userId - ID del usuario dueño
 * @returns {Promise<Model|null>} El proyecto modificado, o null si no se encontró
 */
export const softDelete = async (id, userId) => {
  const project = await findById(id, userId);
  if (!project) {
    return null;
  }
  return await project.update({ status: 'deleted' });
};
