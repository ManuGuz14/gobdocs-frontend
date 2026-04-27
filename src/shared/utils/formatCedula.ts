/**
 * Formatea un valor de cédula dominicana al formato XXX-XXXXXXX-X
 * Solo permite dígitos y agrega guiones automáticamente.
 */
export const formatCedula = (value: string): string => {
  // Eliminar todo lo que no sea dígito
  const digits = value.replace(/\D/g, "");

  // Limitar a 11 dígitos
  const limited = digits.slice(0, 11);

  // Aplicar formato XXX-XXXXXXX-X
  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 10) {
    return `${limited.slice(0, 3)}-${limited.slice(3)}`;
  } else {
    return `${limited.slice(0, 3)}-${limited.slice(3, 10)}-${limited.slice(10, 11)}`;
  }
};
