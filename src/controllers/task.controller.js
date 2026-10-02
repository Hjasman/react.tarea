import * as taskService from '../services/task.service.js';
import { successResponse } from '../utils/response.js';

/**
 * Obtiene todas las tareas asociadas a un proyecto paginadas.
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 */
export const getAllTasks = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const tasks = await taskService.findAllTasks(
    req.params.projectId,
    page,
    limit
  );

  return successResponse(res, tasks, 'Tareas obtenidas');
};

/**
 * Crea una nueva tarea dentro de un proyecto.
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 */
export const createTask = async (req, res) => {
  const task = await taskService.createTask({
    ...req.body,
    projectId: req.params.projectId,
  });

  return successResponse(res, task, 'Tarea creada', 201);
};

/**
 * Actualiza los datos de una tarea específica.
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 */
export const updateTask = async (req, res) => {
  const { id, title, description } = req.body;
  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;

  const task = await taskService.updateTask(
    id,
    req.params.projectId,
    updateData
  );

  return successResponse(res, task, 'Tarea actualizada');
};

/**
 * Elimina una tarea de la base de datos de manera física.
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 */
export const deleteTask = async (req, res) => {
  await taskService.deleteTask(req.body.id, req.params.projectId);

  return successResponse(res, null, 'Tarea eliminada');
};

/**
 * Marca una tarea como completada.
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 */
export const completeTask = async (req, res) => {
  const task = await taskService.completeTask(
    req.body.id,
    req.params.projectId
  );

  return successResponse(res, task, 'Tarea completada');
};

/**
 * Marca una tarea como pendiente.
 * @param {import('express').Request} req - Objeto de petición Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 */
export const pendingTask = async (req, res) => {
  const task = await taskService.pendingTask(req.body.id, req.params.projectId);

  return successResponse(res, task, 'Tarea pendiente');
};
