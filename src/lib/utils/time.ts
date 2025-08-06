
export  function timeAgo(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const now = new Date();
  const diff = (date.getTime() - now.getTime()) / 1000; // en secondes

  const ranges: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, 'second'],
    [60 * 60, 'minute'],
    [60 * 60 * 24, 'hour'],
    [60 * 60 * 24 * 7, 'day'],
    [60 * 60 * 24 * 30, 'week'],
    [60 * 60 * 24 * 365, 'month'],
    [Infinity, 'year']
  ];

  for (const [seconds, unit] of ranges) {
    if (Math.abs(diff) < seconds) {
      const value = Math.round(diff / (seconds / (unit === 'second' ? 1 : 60)));
      return rtf.format(value, unit);
    }
  }

  return '';
}
