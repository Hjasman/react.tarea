import User from '../entities/user.entity.js';

/**
 * Inserta un nuevo usuario en la base de datos.
 * @param {Object} data - Objeto con los datos del usuario a crear
 * @returns {Promise<Model>} Instancia del usuario creado
 */
export const create = async (data) => {
  return await User.create(data);
};

/**
 * Busca a un usuario por su correo electrónico.
 * @param {string} email - Correo del usuario a buscar
 * @returns {Promise<Model|null>} El usuario si existe, o null
 */
export const findByEmail = async (email) => {
  return await User.findOne({
    where: {
      email,
    },
  });
};

/**
 * Busca a un usuario por su ID (Primary Key).
 * @param {string} id - ID del usuario a buscar
 * @returns {Promise<Model|null>} El usuario si existe, o null
 */
export const findById = async (id) => {
  return await User.findByPk(id);
};
