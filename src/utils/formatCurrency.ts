export function formatCurrency(amount: number, currency: string = 'EUR', locale: string = 'en') {
  return amount.toLocaleString(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
} 