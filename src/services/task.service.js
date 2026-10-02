import * as taskRepository from '../repositories/task.repository.js';
import { AppError } from '../utils/AppError.js';

/**
 * Crea una tarea en la base de datos.
 * @param {Object} data - Datos de la tarea (title, description, projectId)
 * @returns {Promise<Object>} La tarea creada
 */
export const createTask = async (data) => {
  return await taskRepository.create(data);
};

/**
 * Obtiene todas las tareas de un proyecto con paginación.
 * @param {string} projectId - ID del proyecto
 * @param {number} page - Número de página
 * @param {number} limit - Cantidad de tareas por página
 * @returns {Promise<Object>} Tareas y metadatos de paginación
 */
export const findAllTasks = async (projectId, page, limit) => {
  return await taskRepository.findAllByProject(projectId, page, limit);
};

/**
 * Actualiza los campos de una tarea (título, descripción, etc).
 * @param {string} id - ID de la tarea
 * @param {string} projectId - ID del proyecto al que pertenece
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} La tarea actualizada
 * @throws {AppError} Si la tarea no se encuentra
 */
export const updateTask = async (id, projectId, data) => {
  const task = await taskRepository.findById(id, projectId);

  if (!task) {
    throw new AppError('Tarea no encontrada', 404);
  }

  return await taskRepository.update(task, data);
};

/**
 * Elimina físicamente una tarea de la base de datos.
 * @param {string} id - ID de la tarea
 * @param {string} projectId - ID del proyecto al que pertenece
 * @throws {AppError} Si la tarea no se encuentra
 */
export const deleteTask = async (id, projectId) => {
  const task = await taskRepository.findById(id, projectId);

  if (!task) {
    throw new AppError('Tarea no encontrada', 404);
  }

  await taskRepository.remove(task);
};

/**
 * Marca una tarea específica como completada.
 * @param {string} id - ID de la tarea
 * @param {string} projectId - ID del proyecto al que pertenece
 * @returns {Promise<Object>} La tarea completada
 * @throws {AppError} Si la tarea no se encuentra
 */
export const completeTask = async (id, projectId) => {
  const task = await taskRepository.findById(id, projectId);

  if (!task) {
    throw new AppError('Tarea no encontrada', 404);
  }

  return await taskRepository.update(task, {
    completed: true,
  });
};

/**
 * Marca una tarea específica como pendiente.
 * @param {string} id - ID de la tarea
 * @param {string} projectId - ID del proyecto al que pertenece
 * @returns {Promise<Object>} La tarea pendiente
 * @throws {AppError} Si la tarea no se encuentra
 */
export const pendingTask = async (id, projectId) => {
  const task = await taskRepository.findById(id, projectId);

  if (!task) {
    throw new AppError('Tarea no encontrada', 404);
  }

  return await taskRepository.update(task, {
    completed: false,
  });
};
