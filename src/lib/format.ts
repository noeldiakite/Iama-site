export const formatPrix = (prix: number | null | undefined, locale: string): string | null => {
  if (prix === null || prix === undefined || prix <= 0) return null
  return `${new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'fr-FR').format(prix)} FCFA`
}

export const formatDate = (
  date: string | null | undefined,
  locale: string,
  opts?: Intl.DateTimeFormatOptions,
) => {
  if (!date) return ''
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Bamako',
    ...opts,
  }).format(new Date(date))
}

export const formatPeriode = (debut: string, fin: string | null | undefined, locale: string) => {
  if (!fin || fin.slice(0, 10) === debut.slice(0, 10)) return formatDate(debut, locale)
  const short = { day: 'numeric', month: 'short' } as const
  return `${formatDate(debut, locale, short)} → ${formatDate(fin, locale)}`
}
