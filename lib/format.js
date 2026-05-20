/**
 * Format a price stored in the currency's smallest unit (cents) to a localized string.
 * Default locale `de-DE` gives `49,00 €` — change to `en-IE` for `€49.00`.
 */
export function formatPrice(amountInCents, currency = 'EUR', locale = 'en-IE') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amountInCents / 100);
}
