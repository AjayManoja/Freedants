const CURRENCY_SYMBOLS: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };

/** Indian digit grouping: 1500 → "1,500", 150000 → "1,50,000". */
function groupIndian(n: number): string {
  const [int, dec] = Math.abs(n).toFixed(Number.isInteger(n) ? 0 : 2).split('.');
  const last3 = int.slice(-3);
  const rest = int.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  const grouped = rest ? `${rest},${last3}` : last3;
  return (n < 0 ? '-' : '') + grouped + (dec ? `.${dec}` : '');
}

/** "₹ 1,500" — the design puts a space between symbol and amount. */
export function formatMoney(amount: number, currency = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${symbol} ${groupIndian(amount)}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "10 Aug 26" */
export function formatShortDate(iso: string | Date): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
}

/** "11:50 PM" */
export function formatTime(iso: string | Date): string {
  const d = new Date(iso);
  const h12 = d.getHours() % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
}

/** "10 Aug 26, 11:50 PM" */
export function formatDateTime(iso: string | Date): string {
  return `${formatShortDate(iso)}, ${formatTime(iso)}`;
}

/** "12.4 MB" */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
