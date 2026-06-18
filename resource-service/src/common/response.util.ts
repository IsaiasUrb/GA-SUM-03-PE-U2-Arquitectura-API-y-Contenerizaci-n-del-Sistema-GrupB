export function successResponse<T>(
  data: T,
  message = 'Operación realizada correctamente',
) {
  return {
    status: 'success',
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}