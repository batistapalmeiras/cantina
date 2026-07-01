export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}
export function maskCurrencyInput(value: string): string {
  const onlyNumbers = value.replace(/\D/g, '');

  if (!onlyNumbers) return '';

  const num = parseInt(onlyNumbers, 10) / 100;
  return formatCurrency(num).replace('R$ ', '');
}
