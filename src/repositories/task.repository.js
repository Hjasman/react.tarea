import Task from '../entities/task.entity.js';

/**
 * Obtiene todas las tareas registradas globalmente (Sin filtro).
 * @returns {Promise<Array<Model>>}
 */
export const findAll = async () => {
  return await Task.findAll();
};

/**
 * Inserta una nueva tarea en la base de datos.
 * @param {Object} data - Datos de la tarea a crear
 * @returns {Promise<Model>}
 */
export const create = async (data) => {
  return await Task.create(data);
};

// export const findAllByUser = async (userId) => {
//   return await Task.findAll({
//     where: {
//       userId,
//     },
//     include: [
//       {
//         model: User,
//         as: 'user',
//         attributes: ['id', 'name', 'email'],
//       },
//     ],
//   });
// };

/**
 * Busca todas las tareas de un proyecto específico con paginación.
 * Retorna los items y los datos necesarios para metadatos de paginación.
 * @param {string} projectId - ID del proyecto contenedor
 * @param {number} page - Número de página actual
 * @param {number} limit - Tamaño de la página
 * @returns {Promise<Object>} Objecto conteniendo items y configuración de paginación
 */
export const findAllByProject = async (projectId, page, limit) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Task.findAndCountAll({
    where: {
      projectId,
    },
    attributes: ['id', 'title', 'description', 'completed', 'createdAt'],

    limit,
    offset,

    order: [['createdAt', 'DESC']],
  });

  return {
    items: rows,

    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

/**
 * Busca una tarea específica por su ID asegurando que pertenece a un proyecto.
 * @param {string} id - ID de la tarea
 * @param {string} projectId - ID del proyecto dueño
 * @returns {Promise<Model|null>} La tarea, o null
 */
export const findById = async (id, projectId) => {
  return await Task.findOne({
    where: {
      id,
      projectId,
    },
  });
};

/**
 * Aplica cambios a la instancia de un modelo Tarea.
 * @param {Model} task - Instancia de Sequelize de la tarea
 * @param {Object} data - Valores a actualizar
 * @returns {Promise<Model>} La tarea actualizada
 */
export const update = async (task, data) => {
  return await task.update(data);
};

/**
 * Elimina definitivamente un registro de tarea de la base de datos (Hard delete).
 * @param {Model} task - Instancia de Sequelize de la tarea a borrar
 * @returns {Promise<void>}
 */
export const remove = async (task) => {
  return await task.destroy();
};
