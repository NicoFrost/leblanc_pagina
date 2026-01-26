// Formateador de valores para mostrar en formato de moneda
export function valueFormatter(value) {
  if (value === null) return ''
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}