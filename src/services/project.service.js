import * as projectRepository from '../repositories/project.repository.js';
import { AppError } from '../utils/AppError.js';

/**
 * Crea un proyecto asociándolo a un usuario.
 * @param {Object} data - Datos del proyecto (name, description, etc)
 * @param {string} userId - ID del usuario dueño del proyecto
 * @returns {Promise<Object>} El proyecto creado
 */
export const createProject = async (data, userId) => {
  return await projectRepository.create(data, userId);
};

/**
 * Obtiene todos los proyectos de un usuario.
 * @param {string} userId - ID del usuario
 * @returns {Promise<Array>} Lista de proyectos
 */
export const findAllProjects = async (userId) => {
  return await projectRepository.findAllByUser(userId);
};

/**
 * Busca un proyecto por ID asegurando que pertenece al usuario.
 * @param {string} id - ID del proyecto
 * @param {string} userId - ID del usuario dueño
 * @returns {Promise<Object>} El proyecto encontrado
 * @throws {AppError} Si el proyecto no existe o no pertenece al usuario
 */
export const getProject = async (id, userId) => {
  const project = await projectRepository.findById(id, userId);
  if (!project) {
    throw new AppError('Proyecto no encontrado', 404);
  }
  return project;
};

/**
 * Actualiza los datos de un proyecto existente.
 * @param {string} id - ID del proyecto
 * @param {string} userId - ID del usuario dueño
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<Object>} El proyecto actualizado
 * @throws {AppError} Si el proyecto no existe
 */
export const updateProject = async (id, userId, data) => {
  const project = await projectRepository.update(id, userId, data);
  if (!project) {
    throw new AppError('Proyecto no encontrado', 404);
  }
  return project;
};

/**
 * Realiza un borrado lógico de un proyecto cambiando su estado.
 * @param {string} id - ID del proyecto
 * @param {string} userId - ID del usuario dueño
 * @returns {Promise<Object>} El proyecto marcado como borrado
 * @throws {AppError} Si el proyecto no existe
 */
export const deleteProject = async (id, userId) => {
  const project = await projectRepository.softDelete(id, userId);
  if (!project) {
    throw new AppError('Proyecto no encontrado', 404);
  }
  return project;
};
