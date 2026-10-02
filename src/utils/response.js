export const successResponse = (
  res,
  data,
  message = 'Éxito',
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
