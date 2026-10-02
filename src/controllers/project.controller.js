import * as projectService from '../services/project.service.js';
import { successResponse } from '../utils/response.js';

/**
 * Obtiene todos los proyectos del usuario actual.
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 */
export const getAllProjects = async (req, res) => {
  const projects = await projectService.findAllProjects(req.user.id);
  return successResponse(res, projects, 'Proyectos obtenidos');
};

/**
 * Crea un nuevo proyecto para el usuario.
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 */
export const createProject = async (req, res) => {
  const project = await projectService.createProject(req.body, req.user.id);

  return successResponse(res, project, 'Proyecto creado', 201);
};

/**
 * Obtiene un proyecto específico por su ID.
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 */
export const getProject = async (req, res) => {
  const project = await projectService.getProject(req.params.id, req.user.id);
  return successResponse(res, project, 'Proyecto obtenido');
};

/**
 * Actualiza la información de un proyecto.
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 */
export const updateProject = async (req, res) => {
  const project = await projectService.updateProject(
    req.params.id,
    req.user.id,
    req.body
  );
  return successResponse(res, project, 'Proyecto actualizado');
};

/**
 * Realiza un borrado lógico (soft delete) de un proyecto.
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 */
export const deleteProject = async (req, res) => {
  const project = await projectService.deleteProject(
    req.params.id,
    req.user.id
  );
  return successResponse(res, project, 'Proyecto eliminado (soft delete)');
};
